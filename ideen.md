# Ideen & mögliche Erweiterungen – Toiletten-Pass

Sammeldatei für Verbesserungs- und Erweiterungsideen. Stand: 10.11.2026.
Noch nicht umgesetzt – dient als Backlog für die Diskussion mit dem Kollegium.

---

## A. Für den Schulalltag (hoher Nutzen)

### A1. Screen-Wake-Lock (API) ✅ bestätigt
Die App verhindert per `navigator.wakeLock`, dass das iPad-Display nach
X Minuten abdunkelt. Passt zum Konzept „Display bleibt dauerhaft an".
Aufwand: ~15 Zeilen Code, keine Bibliothek nötig.
**iPad-Tauglichkeit: JA** – Safari unterstützt die API seit iPadOS 16.4
(also auf jedem aktuellen Schul-iPad). Voraussetzung: HTTPS-Verbindung,
die eh für die Kamera nötig ist. In Kombination mit Jamf
„Geführter Zugriff" sehr robust.

### A2. CSV/JSON-Export-Button ✅ bestätigt
Neben „Sammel-QR" ein Button „Daten exportieren", der die gespeicherten
Tagesdaten als `.csv`-Datei downloaded (Excel-kompatibel). Für die
Schulleitung ein Segen, wenn sie mal nichts scannen will/kann.
Kein Server nötig, funktioniert offline.
**Gewünschter Workflow:** Alle paar Tage exportieren → Datei auf
Schulserver/Schul-Laufwerk ablegen → danach „Tagesdaten schreddern".
Passt perfekt zum manuellen Löschkonzept (kein Auto-Reset).

### A3. Service Worker (Mini-PWA) ✅ UMGESETZT
`sw.js` + `manifest.webmanifest` liegen im Projektordner und sind in
beide HTML-Dateien eingebaut. Cache-first-Strategie: Nach dem ersten
Öffnen mit Netz läuft alles offline – auch die Bibliotheken, da diese
ebenfalls lokal liegen (siehe C1). **Pflicht vor Veröffentlichung
umgesetzt, weil WLAN-Ausfälle im Schulalltag vorkommen.**

### A4. Live-Uhrzeit im Header
Kleine Uhr rechts oben. Hilft der Lehrkraft bei „Um wie viel Uhr war
das?", ohne auf die iPad-Uhr zu schauen.

### A7. Uhrzeit-/Dauer-Format einstellbar ⏰ NEU
Die Anzeigeformatierung soll konfigurierbar sein, z. B.:
* Uhrzeit mit oder ohne Sekunden (`10:14` vs. `10:14:32`)
* Dauer in Minuten gerundet vs. `MM:SS` vs. `Std. Min.`
* Als Konstanten im Code-Block „HIER KANNST DU DIE APP LEICHT ANPASSEN".

### A5. Ton an/aus-Schalter
Falls eine Stunde „leise" sein soll (z. B. Klausur), ein dezenter
Mute-Button. Standard: Ton an.

### A6. Periodischer Erinnerungs-Ton ⏰ NEU
Wenn ein Kind schon länger als X Minuten unterwegs ist, soll in
regelmäßigen Abständen ein Ton ertönen – als „Aha, da ist noch jemand
unterwegs"-Erinnerung für die Lehrkraft.
* **Intervall einstellbar** (z. B. alle 5, 10, 12 ... Minuten)
* **Start-Schwelle einstellbar** (z. B. erst ab 5 Minuten Abwesenheit)
* Beides als Konstanten im Code-Block „HIER KANNST DU DIE APP LEICHT
  ANPASSEN" – gleiches Prinzip wie `WARN_AFTER_MINUTES`.
* Design-Frage: nur ein kurzer Signalton, oder sichtbares Blinken der
  betroffenen Karte zusätzlich? → im Kollegium klären.

---

## B. Für die Testphase (vor Veröffentlichung relevant)

### B1. Test-Modus per URL
`?test=1` blendet ein sichtbares „TEST"-Banner ein. So testet ihr auf
echten iPads, ohne dass Kinder die Demo für echt halten – und ohne
dass jemand aus Versehen reale Daten schreddert.

### B2. Test-Szenario-Button (versteckt)
`?demo=1` füllt das Terminal mit 3–4 Fake-Gängen, damit ihr die Anzeige,
den Zeitfilter und den Admin-QR ohne echte Kinder durchspielen könnt.

---

## C. Robustheit & Datenschutz

### C1. Self-hosted Libraries ✅ UMGESETZT
`tailwind.js`, `qrcode.min.js`, `html5-qrcode.min.js` liegen lokal im
Projektordner – keine CDN-Abhängigkeit mehr. Muss beim FTP-Upload
mit-hochgeladen werden (siehe Hosting-Anleitung in der Doku).

### C2. Kamera-Fehlernavigation
Wenn der Kamerazugriff verweigert wird, zeigt die App aktuell nur
einen Alert. Eleganter: Ein Hinweis-Box mit Schritt-für-Schritt
(„Einstellungen → Safari → Kamera erlauben").

---

## D. Architektur-Optionen (größere Entscheidungen)

### D1. Backend / ein-Klick-Abruf *(nicht empfohlen für dieses Projekt)*
Damit die Schulleitung alle Klassendaten „mit einem Klick" ziehen
kann, bräuchte es einen Server mit Datenbank: Jedes iPad schickt seine
Daten per POST an den Server, `admin_sync.html` fragt per Klick ab.
Machbar auf der Subdomain, aber es bricht das „kein Server"-Prinzip:
- Server speichert jetzt pseudonyme Kinderdaten (DSGVO-Aufwand steigt)
- Internet-Ausfall im Klassenzimmer → Scans gehen evtl. verloren
- Server-Software muss gepflegt und abgesichert werden
**Fazit:** QR-Transfer bleibt das datenschutzfreundlichste Design.
Backend erst evaluieren, wenn Auswertungsbedarf oder QR-Kapazität es erzwingen.

### D2. PWA-Installation im App-Store-Sinn
Nicht nötig – Jamf-Webclip + `apple-mobile-web-app-capable` (siehe A3)
erreicht denselben „native App"-Effekt ohne Store-Aufwand.

---

## Umgesetzt (zum Vergleich, nicht mehr offen)

- ✅ `?klasse=`-Parameter für die Klassenzuordnung pro iPad (nur Ersteintrag)
- ✅ V2-QR-Format mit Datum (gruppiert pro Tag) + V1-Rückwärtskompatibilität
- ✅ Admin-Decoder `admin_sync.html` mit Datumsspalte
- ✅ Warnton nach `WARN_AFTER_MINUTES` (Standard 5 Min., einmalig pro Gang)
- ✅ Manuelle Löschung statt Auto-Reset (DSGVO: Speicherfrist selbst festlegen)

## Bekannte Grenze

QR-Codes haben ~3 KB Kapazität. Bei monatelang ungeschredderten Daten
könnte der Sammel-QR zu dicht für die Kamera werden. Falls nötig:
Blätter-Modus „Tag X von Y" im Terminal nachrüsten.
