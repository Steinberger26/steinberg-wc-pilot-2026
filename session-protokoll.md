# Session-Protokoll: Toiletten-Pass (Klo-Guard)
**Stand: 20.11.2026** – Projektstatus für Weiterarbeit auf einem anderen PC.

---

## 1. Projektüberblick

Pseudonymes Toiletten-Abmeldesystem für Grundschulklassen: QR-Code-Scan pro
Kind am Klassen-iPad, lokale Speicherung (localStorage), keine Namen,
kein Server, keine Cloud. Zielgruppe: Lehrkräfte; Zielgerät: iPad (Jamf).

**Dateien im Projektordner** (`C:\Users\Arcan\Downloads\Klo-Guard` – auf
dem anderen PC den ganzen Ordner kopieren!):

| Datei | Zweck |
|---|---|
| `toiletten_terminal.html` | Haupt-App (Klassen-Terminal) |
| `admin_sync.html` | Admin-Ausleser für Sammel-QRs |
| `tailwind.js` | Design-Bibliothek (lokal, 407 KB) |
| `qrcode.min.js` | QR-Code-Zeichner (lokal) |
| `html5-qrcode.min.js` | Kamera-Scanner (lokal, 375 KB) |
| `sw.js` | Service Worker (Offline-Cache) |
| `manifest.webmanifest` | App-Manifest |
| `robots.txt` | Suchmaschinen-Sperre |
| `projektdokumentation.md` | Vollständige Tech-Doku inkl. Tutorial-Kap. 8 |
| `anleitung.md` | Anleitung für Schüler + Lehrkräfte/Admin |
| `ideen.md` | Backlog mit allen Ideen & Status |

**Wichtig:** Alle Dateien müssen beim Hosting **im selben Ordner** liegen.

---

## 2. Umgesetzte Features (alle funktionsfähig)

- QR-Scan via Kamera (bevorzugt **hintere** Kamera, Fallback Front) via html5-qrcode + 30er-Tippfeld (eingeklappt) +direkte Nummerneingabe
- Check-out/Check-in-Logik, 2,5 s Scan-Cooldown
- **Großes Scan-Symbol** in der Bildschirmmitte (🚪 Raus / ↩️ Zurück /
  ⚠️ Moment) – erscheint bei Kamera-Scan UND manueller Eingabe
- Lehrer-Bestätigung beim zweiten Kind (Modal)
- Web-Audio-Töne: Abgang (hoch), Rückkehr (tief), Warnung (Sägezahn)
- **Warnton** nach `WARN_AFTER_MINUTES` (Standard 5 Min., einmalig pro Gang)
- **Rot-Hinweis** ab `OVERDUE_MINUTES` (Standard 10 Min., „Bitte nachsehen!")
- Live-Timer „Aktuell auf Toilette", Tagesprotokoll-Tabelle
- **QR-Druckbogen** (30 Kärtchen, `window.print()`)
- **Schadens-Zeitfilter** (Von/Bis-Filter über alle Gänge)
- **Sammel-QR für Admin** → `admin_sync.html` (Kamera + manueller Fallback)
- **Manuelles Schreddern** (DSGVO) – bewusst KEIN Auto-Reset
- **Klassenname pro Gerät** gespeichert; optional per URL `?klasse=3a`
  (gilt nur beim allerersten Start)
- **Klassen-Erkennung in QR-Codes** (`KLASSENCODE-Nummer`, z. B. `2B-05`):
  fremde Klassenkarten werden abgelehnt; Karten zeigen Klassennamen.
  Achtung: Klassennamen-Änderung → Karten neu drucken
- **Branding/Kopierschutz:** `SCHOOL_NAME` + `schul-logo.png` (optional)
  im Header/Druckbogen/Admin-QR (V3-Format); **Domain-Sperre**
  (`ALLOWED_DOMAIN` in beiden HTML-Dateien) – App läuft nur auf eigener
  Domain + localhost/privaten IPs/trycloudflare für Tests
- **V3-QR-Format** mit Datum + Schulname (`V3;Schule;Klasse;JJJJMMTT:...`),
  V1/V2-Rückwärtskompatibilität in `admin_sync.html`
- **Offline-fähig:** Service Worker cached alles; Bibliotheken lokal
  (keine CDNs mehr)
- **`noindex`/`robots.txt`** gegen Suchmaschinen-Indexierung
- Einstellbare Konstanten im Code (`TOTAL_STUDENTS`,
  `WARN_AFTER_MINUTES`, `OVERDUE_MINUTES`)

## 3. Getroffene Architektur-Entscheidungen

- **Kein Backend, kein Server-Speicher** – Daten nur in localStorage pro iPad.
  Admin-Sync läuft optisch per QR (Air-Gap).
- **Kein Auto-Reset** – Daten bleiben bis manuell geschreddert (DSGVO:
  Speicherfrist selbst festlegen). Workflow-Idee: alle paar Tage CSV-Export
  → dann schreddern (CSV-Export ist Backlog-Idee A2).
- **Interne Subdomain bevorzugt**, aber: Server speichert keine Daten →
  öffentliche Variante wäre datenschutzlich unkritisch (nur App-Hülle).

## 4. Hosting-Status & offene Punkte

**Geplant:** Subdomain `wcguard.schule.de` beim Anbieter **FCHosting**
(bis zu 10 Subdomains möglich, "nicht von außen erreichbar" stellbar,
SSL aktivierbar). **Noch nicht live** – Dateien noch nicht hochgeladen.

**Offene Punkte:**
1. **`ALLOWED_DOMAIN`** in `toiletten_terminal.html` UND `admin_sync.html`
   auf die echte Domain setzen (aktuell Platzhalter `wcguard.schule.de`;
   Hosting ist jetzt **GitHub Pages** → z. B. `max-mustermann.github.io`),
   optional `schul-logo.png` ablegen
2. ~~`SCHOOL_NAME`~~ ✅ bereits eingetragen: `GGS Steinberg`
   `sw.js` → `CACHE_NAME` auf `kloguard-v2` hochzählen
2. Subdomain + SSL bei FCHosting anlegen, Dateien hochladen
   (8 Dateien, gleicher Ordner). Achtung: Wenn "intern-only" + Let's-Encrypt
   → SSL-Ausstellung kann fehlschlagen (braucht externe Erreichbarkeit).
2. **Testphase:** iPad/Android-Handy testen – lokal via
   `python -m http.server 8000` (nur ohne Kamera) oder via Cloudflare
   Quick Tunnel `cloudflared tunnel --url http://localhost:8000`
   (echtes HTTPS → Kamera funktioniert).
3. Nächste geplante Features aus `ideen.md`: Wake-Lock (A1),
   CSV-Export (A2), periodischer Erinnerungs-Ton (A6),
   Uhrzeit-Format einstellbar (A7), Test-Modus `?test=1`/`?demo=1` (B1/B2).

## 5. Technische Details (für die Weiterarbeit)

- **localStorage-Keys:** `school_toilet_sessions_v1`, `school_toilet_class_v1`
  (Admin: `admin_sync_events_v1`)
- **QR-Payload V3:** `V3;Schule;Klasse;JJJJMMTT:Nummer:HHMM:HHMM#...;JJJJMMTT:...`
  (`9999` = noch draußen, Datum gruppiert pro Tag für QR-Kapazität;
  `admin_sync.html` liest auch V2/V1)
- **HTTPS-Pflicht:** Kamera + Service Worker brauchen HTTPS →
  `http://` nur für Nummernfeld-Tests
- **Service Worker:** Bei Updates `CACHE_NAME` in `sw.js` hochzählen
  (`kloguard-v1` → `v2`), sonst sehen Geräte die alte Version
- **Audio-Unlock:** iOS braucht einen Nutzertipp vor Audio – per
  `pointerdown`-Listener gelöst
- **Kodierungs-Falle:** In `promptChangeClass`/`SCHOOL_NAME` werden `;` und
  `#` aus Namen entfernt (würden QR-String unlesbar machen)

## 6. Datei-Änderungsverlauf (Kurzfassung)

1. Analyse gegen Doku → CDN-Abhängigkeit, fehlender Admin-Decoder, etc.
2. Bugs gefixt: Nummernlimit 30, Audio-Unlock iOS, echte Dauer, Footer-Text
3. Auto-Reset entfernt (Absprache)
4. `admin_sync.html` NEU erstellt
5. `?klasse=`-Parameter eingebaut
6. V2-QR-Format mit Datum (Terminal + Admin-Parser)
7. Self-hosted Libraries + Service Worker + Manifest (Offline-Fähigkeit)
8. `noindex` + `robots.txt`
9. `projektdokumentation.md` + `anleitung.md` + `ideen.md` gepflegt
10. Klassen-Erkennung in QR-Codes (`2B-05`), Fremd-Karten werden abgelehnt
11. Branding + Domain-Sperre + V3-QR-Format (Schulname im Admin-Export)

## 7. Wie man weitermacht

1. **Ganzen Ordner kopieren** auf den anderen PC (inkl. aller 8 Dateien
   + 3 Markdown-Doku-Dateien)
2. **Markdown-Dateien zuerst lesen:** `projektdokumentation.md` (§8 =
   Code-Tutorial), `ideen.md` (Backlog), dieses Protokoll
3. **HTML-Dateien:** `toiletten_terminal.html` (Haupt-App, ~1240 Zeilen),
   `admin_sync.html` (~380 Zeilen)
4. **Nächster Schritt:** FCHosting-Subdomain anlegen + Dateien hochladen
   ODER erst lokal testen (`python -m http.server 8000`)
