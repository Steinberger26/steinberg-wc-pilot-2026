# WC-Pass – Technische FAQ & Funktionsübersicht
**Für: technically versierte Personen (Schul-IT, Entwickler, Datenschutzbeauftragte)**
**Stand: November 2026 – GGS Steinberg**

Dieses Dokument beschreibt das System auf technischer Ebene: Architektur, Browser-APIs, Datenfluss, Sicherheitskonzept und bekannte Grenzen. Es ist als Nachschlagewerk gedacht, um bei Fachfragen souverän antworten zu können.

---

## 1. Systemarchitektur

### Wie ist das System aufgebaut?
Client-only Web-App ohne Backend. Zwei eigenständige HTML-Dateien plus statische Assets, gehostet als statische Site (GitHub Pages). Es gibt **keinen Application-Server, keine Datenbank, keinen API-Endpunkt** – die „Server"-Komponente liefert ausschließlich unveränderliche Dateien aus.

| Komponente | Datei | Zweck |
| :--- | :--- | :--- |
| Klassen-Terminal | `toiletten_terminal.html` | Scanner, Check-in/out-Logik, Töne, Druckbogen, Admin-Export |
| Admin-Ausleser | `admin_sync.html` | Parst Sammel-QRs, dedupliziert, zeigt Gesamtübersicht |
| Offline-Cache | `sw.js` | Service Worker, Cache-first-Strategie |
| App-Manifest | `manifest.webmanifest` | PWA-/Webclip-Integration (iPad) |
| Bibliotheken (lokal) | `tailwind.js`, `qrcode.min.js`, `html5-qrcode.min.js` | Styling, QR-Generierung, Kamera-Scanning |
| `robots.txt` | — | `Disallow: /` gegen Indexierung |

**Bewusst keine Backend-Komponente:** Datenresidenz bleibt auf dem Endgerät. Ein Server hätte nur das Ausliefern statischer Dateien zu bieten – jede Persistenz auf Serverseite würde die DSGVO-Position („keine Server-Speicherung") konterkarieren.

### Wie werden Daten zwischen Klassen-iPad und Schulleitung ausgetauscht?
**Optische Übertragung (Air-Gap):** Das Terminal serialisiert den kompletten Sitzungsverlauf in ein kompaktes String-Format und rendert ihn als QR-Code auf dem Display. `admin_sync.html` dekodiert den String per Kamera (`html5-qrcode`, `environment`-Kamera) oder per manueller Eingabe. Es gibt **keine Netzverbindung** zwischen den Geräten – die Integrität hängt ausschließlich an der QR-Lesbarkeit.

---

## 2. Persistenz & Datenmodell

### Wo und wie werden Daten gespeichert?
`localStorage` (Origin-gebunden, persistent, synchron). Pro iPad genau ein Origin (`https://<user>.github.io/<repo>/`), dadurch ist die Trennung zwischen Klassen-iPads automatisch gegeben – gleicher Code, verschiedene Storage-Partitionen.

**Keys:**
- `school_toilet_sessions_v1` → `{ active: Session[], completed: Session[] }`
- `school_toilet_class_v1` → Klassenname (String)
- `admin_sync_events_v1` → gemergte Events der Schulleitung

**Session-Objekt:** `{ id, number, checkoutTime, checkinTime?, durationMinutes?, warnedLongAway }` – bewusst ohne Freitextfelder, ohne Geolocation, ohne Device-ID.

### Gibt es einen automatischen Reset?
**Nein, explizit entfernt.** Die anfängliche Implementierung hatte einen Mitternachts-Reset; er wurde gestrichen, weil (a) die Schul-IT die Speicherfrist selbst festlegen will und (b) ein offenes iPad über Mitternacht hinweg inkonsistent war. Löschen erfolgt ausschließlich manuell über den „Schredder" (`localStorage.removeItem` + Re-Render). Optional ließe sich ein konfigurierbarer TTL-Mechanismus nachrüsten.

### Wie skalieren die Daten über die Zeit?
Ohne Reset wächst `completed` unbegrenzt. In der Praxis: ~30 Kinder × ~4 Gänge/Tag × ~150 Tage ≈ 18.000 Events – für `localStorage` (iOS-Quotum ~5 MB pro Origin, real ~50 MB nutzbar) unkritisch, aber die UI-Render-Performance könnte bei sehr großen Listen leiden. `admin_sync.html` capped implizit durch QR-Kapazität (s. §7).

---

## 3. Scanner & Kamera-Pipeline

### Welche Browser-APIs werden genutzt?
- **`navigator.mediaDevices.getUserMedia({ video: { facingMode } })`** – Kamera-Stream. Erfordert **secure context** (HTTPS oder localhost). Bevorzugt `environment` (Rückkamera), Fallback `user` (Front).
- **`Html5Qrcode`** (vendored `html5-qrcode.min.js`) – kapselt den Barcode-Detection-Pfad. Greift auf `BarcodeDetector` zurück, falls verfügbar, sonst auf die eingebaute ZXing-Engine.
- **`AudioContext` + `OscillatorNode`** – Web Audio API für die drei Signalton-Typen (kein Audio-Asset nötig).

### iOS-spezifische Audio-Problematik & Lösung
Safari erlaubt `AudioContext`-Wiedergabe erst nach einer **User-Gesture** ( autoplay policy). Gelöst über `pointerdown`-Listener, der den Context eager initialisiert und `resume()` aufruft. Scans, die direkt nach einem Tap folgen, spielen Töne zuverlässig.

### Scan-Pipeline (Reihenfolge der Prüfungen)
1. `onDecodedText` → Cooldown-Check (2,5 s pro Identifier, verhindert Multi-Reads)
2. `parseScanInput()` → Normalisierung (Trim, `KLASSENCODE-`Prefix strippen, Ziffern-Extraktion)
3. **Klassenvalidierung:** `getClassToken()` (abgeleitet aus `currentClass`, u. a.-normalisiert) muss mit dem Token im QR übereinstimmen; fremde Tokens → Reject + `warn`-Feedback + Warnton. Reine Zahlen (Legacy-Format) bleiben akzeptiert.
4. **Range-Validierung:** `1 ≤ n ≤ TOTAL_STUDENTS`
5. **State-Transition:** `active` enthält Nummer → Check-in (Dauer berechnen, `completed` pushen) ; sonst Check-out (bei bereits aktiver Session → Bestätigungs-Modal)
6. **Audio + UI-Feedback** + `localStorage`-Persistenz

### Warum 2,5 s Cooldown?
QR-Decoder emittieren denselben Code über mehrere Frames. Ohne Cooldown entstünden Phantom-Doppel-Scans. Der Cooldown-Key enthält die **volle Identität** (`classToken-number`), nicht nur die Nummer – sonst würden Fremd-Karten die eigene Nummer "sperren".

---

## 4. QR-Code-Formate & Kapazitäts-Management

### Kodierte Payloads

| Version | Format | Inhalt |
| :--- | :--- | :--- |
| V1 (Legacy) | `V1;Klasse;Nummer:HHMM:HHMM#...` | Keine Datumsinfo, kein Schulname |
| V2 | `V2;Klasse;JJJJMMTT:Token#Token;...` | Datum gruppiert pro Tag |
| **V3 (aktuell)** | `V3;Schulname;Klasse;JJJJMMTT:Token#...;JJJJMMTT:...` | + Schulname als Branding/Markierung |

**Token-Format:** `Nummer:HHMMout:HHMMin` (`9999` = noch draußen). **Gruppierung nach Datum** (`JJJJMMTT:` Präfix pro Block) ist die zentrale Kompression: Ein Tag mit 30 Gängen kostet ~11 Bytes/Token, nicht einen separaten Zeitstempel pro Event.

### QR-Kapazitätsgrenze & Konsequenzen
QR-Version 40 (alphanumerisch+Byte-Modus) fasst ~2.900 Bytes. Rechenbeispiel: 30 Kinder × 4 Gänge × 12 Bytes ≈ 1,4 KB/Tag → ~2 Tage pro Code bei vollem Betrieb. **Praktisch unkritisch**, weil der Export typischerweise täglich/wöchentlich erfolgt. Bei Überschreitung: `QRCode`-Library reduced automatisch die Version; bei extremen Datenmengen zeigt der Code-Block eine Warnung.

### Serializer-Details
- `SCHOOL_NAME` und `currentClass` werden vor der Serialisierung von `;` und `#` befreit (`.replace(/[;#]/g, '')`) – kollidiert sonst mit dem Feldtrenner.
- `?klasse=` URL-Parameter wird beim Erststart sanitisiert (gleiche Regex).
- `admin_sync.html` parst **V1/V2/V3** rückwärtskompatibel; Dedup-Key = `school|class|dateKey|number|outHHMM`.

---

## 5. Sicherheit & Schutzkonzept

### Domain-Sperre (Clientseitige Zugriffskontrolle)
`enforceDomainLock()` prüft `location.hostname` gegen Allowlist:
- `ALLOWED_DOMAIN` + Subdomains (`endsWith('.domain')`)
- `localhost`, `127.0.0.1`, `::1`
- Private RFC1918-Adressen (`10.`, `192.168.`, `172.16–31.`) – interne Tests
- `*.trycloudflare.com` – Quick-Tunnel-Tests
- `file://` (leerer Hostname) – lokale Direktöffnung

Bei Verstoß: `document.body.innerHTML` wird durch Sperr-Hinweis ersetzt. **Ehrliche Einordnung:** Das ist Security-by-Obscurity, keine Authentifizierung. Wer DevTools öffnet, kann die Prüfung patchen. Es stoppt jedoch (a) versehentliche Weitergabe auf fremde Domains, (b) die meisten Laien, (c) automatisierte „App klauen"-Szenarien. Der eigentliche Schutz liegt ohnehin in der Datenminimierung.

### Was ein Angreifer maximal erreichen könnte
- **Code lesen/ändern:** Ja, per Definition (Client-seitig). Schaden: Gering – die App enthält keine Secrets.
- **Daten stehlen:** Nur wenn er physisch Zugriff auf ein iPad hat und den localStorage liest. Browser-DevTools → Application → Local Storage. Darum: iPads im Guided Access betreiben.
- **Daten fälschen:** Theoretisch ja (QR-Code selbst generieren). Aber wer das kann, kann auch Papierlisten fälschen – das Threat Model ist realistisch niedrig.

### DSGVO-Einschätzung (für die Datenschutzbeauftragte)
- **Rechtsgrundlage:** Berechtigtes Interesse (Schulbetrieb, § 6 Abs. 1 lit. f DSGVO) i. V. m. Schulgesetzen der Länder.
- **Datenkategorien:** Verhaltensdaten (Aufenthaltszeiten), pseudonymisiert.
- **Auftragsverarbeitung:** **Keine** – keine Datenübermittlung an Auftragsverarbeiter. GitHub Pages ist ein **Hosting-Provider für Programmcodedaten** (DSGVO-konform, AVV verfügbar, US-Transfers via EU-US Data Privacy Framework abgedeckt).
- **Schülerselbstbestimmung:** Einwilligung nicht erforderlich, da keine sensiblen Daten und Clearingstelle über Verfahrensverzeichnis/Schulordnung.
- **Technische Maßnahmen:** Pseudonymisierung, Speicherbegrenzung (manuell), Zugriffsbeschränkung ( Guided Access), keine Tracking-Pixel, `noindex`/`robots.txt`, HTTPS-only.

---

## 6. Offline-Fähigkeit (Service Worker)

### Strategie
**Cache-first** mit Runtime-Caching:

```js
caches.match(request) → hit? return : fetch → ok? clone+cache : fallback
```

- `install`: `cache.addAll(ASSETS)` – 8 Dateien atomar. **Wichtig:** `addAll` ist all-or-nothing; optionale Assets (z. B. `schul-logo.png`) dürfen **nicht** in `ASSETS` stehen, sonst schlägt die Installation bei 404 fehl. Logo wird stattdessen beim ersten Request per `fetch`-Handler gecacht.
- `activate`: alte Caches löschen (`kloguard-v*`), `clients.claim()` für sofortige Übernahme.
- `fetch`: nur `GET`, nur gleicher Origin wird gecacht (`response.ok && origin === location.origin`).

### Cache-Bump-Pflicht
`CACHE_NAME` muss bei jeder Änderung hochgezählt werden (`v1` → `v2`). Sonst sehen Geräte die gecachte alte Version. **Aktuell: `kloguard-v2`.**

### Bekannte Grenzen
- **Kein Background-Sync:** Writes gehen nur in `localStorage` – offline-sicher per Design.
- **Kein Push:** Keine Server-Push-Möglichkeit (kein Backend).
- **iOS-Speicher-Limits:** Safari kann Caches unter Speicherdruck evicten – unkritisch, da `localStorage` primär ist.
- **Erst-Load braucht Netz:** SW kann sich nicht selbst installieren, wenn die Seite offline ist.

---

## 7. QR-Kapazität & Skalierung

### Wie viel Daten passen in einen Admin-QR?
V3-Payload ≈ 60 Bytes Overhead + ~12 Bytes/Token. Bei 30 Kindern × 4 Gängen/Tag: ~1,5 KB/Tag → realistisch **5–10 Tage pro QR-Code**. Für wöchentliche Exporte unkritisch; für "einmal pro Schuljahr" nicht ausreichend. **Lösung:** Entweder regelmäßig exportieren oder `admin_sync.html` um Pagination/Mehrfach-Codes erweitern (Backlog).

### Was passiert bei sehr großen Datenmengen?
`QRCode`-Lib generiert automatisch kleinere Module bei Volllast. Bei > ~2.900 Bytes: Code wird unlesbar. **Monitoring:** `dayBlocks.length` wird in der UI angezeigt; bei > 20 Tagen sollte die Lehrkraft exporting planen.

---

## 8. Deployment & Betrieb

### Hosting
Statische Site auf GitHub Pages (`<user>.github.io/<repo>/`). HTTPS automatisch (Let's Encrypt). `ALLOWED_DOMAIN` muss auf den GitHub-Usernamen gesetzt werden (`const ALLOWED_DOMAIN = '<user>.github.io'`).

### Jamf-Integration
- **Webclip:** Pro iPad ein Webclip auf `https://<user>.github.io/<repo>/toiletten_terminal.html?klasse=<token>` – öffnet im Vollbild ohne Browserleiste.
- **Guided Access:** Single-App-Modus sperrt auf dem Webclip – keine Navigation, kein Home-Swipe, kein App-Wechsel.
- **Einschränkungen:** Homebutton deaktiviert, Volume-Warnung aktiv, Zeitlimit optional.

### Update-Prozess
1. Datei ändern → `git push` → GitHub Pages deployt in ~1–2 Min.
2. `sw.js` `CACHE_NAME` hochzählen (sonst sehen Geräte alte Version).
3. iPads einmal neu laden (oder 24 h warten bis SW-Update automatisch).

### Monitoring & Fehlerbehebung
- **„Kamera startet nicht":** HTTPS prüfen, Berechtigung im Safari-Einstellungen → Websites → Kamera.
- **„Dieses Gerät ist nicht registriert":** `hostname` stimmt nicht mit `ALLOWED_DOMAIN` überein.
- **QR wird nicht erkannt:** Distanz < 30 cm, gute Beleuchtung, laminierte Hülle nicht zu stark verspiegelt.
- **Töne fehlen:** Erster Tap auf die Seite hat noch nicht stattgefunden (Audio-Unlock).

---

## 9. Bekannte Grenzen & ehrliche Einschränkungen

| Thema | Status | Konsequenz |
| :--- | :--- | :--- |
| **Kein Backend** | By Design | Keine Fernwartung, kein zentraler Export ohne optischen QR |
| **Domain-Sperre** | Clientseitig | Umgehbar per DevTools; dient der Abschreckung, nicht der Sicherheit |
| **Kein Auto-Reset** | By Design | Manuelle Löschung erforderlich; vergessene Schredder = Datenakkumulation |
| **QR-Kapazität** | ~5–10 Tage/Export | Bei sehr langen Intervallen: Mehrfach-Exports oder Code-Erweiterung nötig |
| **Keine Gerätebindung** | By Design | localStorage ist pro Origin, nicht pro Gerät – ein Browser-Reset löscht die Daten |
| **Keine Authentifizierung** | By Design | Jeder mit URL-Zugang kann scannen; kein Login nötig (Kindertauglich) |
| **iOS-Speicher-Limits** | Platform | Safari kann unter Druck Caches evicten; localStorage ist robuster |

---

## 10. Glossar für die Konversation

| Begriff | Bedeutung |
| :--- | :--- |
| **Pseudonymisierung** | Daten ohne direkten Personenbezug, aber über Hilfstabelle zuordenbar (Nummer → Name auf Papier) |
| **Air-Gap** | Physische Trennung zweier Systeme; hier: optische QR-Übertragung statt Netz |
| **Service Worker** | Browser-Hintergrundprozess für Offline-Caching |
| **localStorage** | Origin-gebundener Key-Value-Speicher im Browser, persistent |
| **Secure Context** | HTTPS oder localhost – Voraussetzung für Kamera-APIs |
| **Guided Access** | iOS-Funktion für Single-App-Kiosk-Modus |
| **Webclip** | iOS-Homebildschirm-Verknüpfung auf Web-App, öffnet ohne Browserleiste |
| **QR-Version 40** | Maximale QR-Code-Kapazität (~2.900 Bytes alphanumerisch) |
| **RFC1918** | Private IP-Bereiche (10.x, 172.16–31.x, 192.168.x) – nicht routingfähig |
| **AVV** | Auftragsverarbeitungsvertrag – bei GitHub Pages für Hosting-Provider-Daten relevant |

---

*Dieses Dokument ist als technischer Nachweis gedacht: Es zeigt, dass Architektur, Datenschutz und Betrieb bewusst und konsistent umgesetzt wurden. Für die rechtliche Prüfung ersetzt es keine Einbeziehung der Datenschutzbeauftragten bzw. des LSO.*
