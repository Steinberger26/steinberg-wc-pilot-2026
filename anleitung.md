# Anleitung: Der digitale Toiletten-Pass

Diese Anleitung erklärt die Benutzung in zwei Teilen:

1. **Für Schülerinnen und Schüler** – so funktioniert der Scan am iPad
2. **Für Lehrkräfte und die Schulleitung (Admin)** – alle Buttons und Werkzeuge

> **Offline-Hinweis:** Nach dem allerersten Öffnen mit Internet speichert
> das iPad alles automatisch (Service Worker). Ab dann funktioniert das
> Terminal **auch bei komplettem WLAN-Ausfall** weiter – ideal für den
> Schulalltag, in dem das WLAN ab und zu mal streikt.

---

## Teil 1: Für Schülerinnen und Schüler

### So einfach ist es

Das iPad hängt oder steht in der Nähe der Klassenzimmer-Tür. Es zeigt immer,
wer gerade auf der Toilette ist.

> **Tipp:** Die QR-Karten sind **klassenspezifisch** – auf jeder Karte
> steht der Klassenname und der QR-Code enthält die Klassenkennung
> (z. B. `2B-05`). Scannt ein Kind versehentlich eine Karte aus einer
> anderen Klasse, erscheint eine Warnung und es wird nichts gebucht.

### Wenn du rausgehst ( Toilette besuchen )

1. Nimm dein **Federmäppchen** – darauf klebt dein persönlicher QR-Code.
2. Halte den QR-Code **kurz vor die Kamera** des iPads.
   (Alternativ: Tippe deine Nummer auf dem Nummernfeld.)
3. Du hörst einen **freundlichen, hohen Zweiklang**.
4. Das Display zeigt: **„Nummer 03 hat den Raum verlassen"**.

👉 **Fertig. Du kannst zur Toilette gehen.**

### Wenn du zurückkommst

1. Halte deinen QR-Code **noch einmal** vor die Kamera.
2. Du hörst einen **tieferen, satteren Ton**.
3. Das Display zeigt: **„Nummer 03 ist zurück im Raum"**.

👉 **Fertig. Der Gang ist erledigt.**

### Wichtige Regeln

| Regel | Warum? |
| :--- | :--- |
| **Immer scannen – auch wenn es eilig ist** | Nur so kann die Lehrkraft nachvollziehen, wer wann draußen war. |
| **Karte nicht mit anderen tauschen** | Jeder hat seine eigene Nummer. Wer die Karte eines anderen nutzt, verwirrt das System. |
| **Karte nicht kaputt machen oder wegwerfen** | Die Karte ist wie ein Schlüssel. Ist sie kaputt, meldest du dich bei der Lehrkraft – sie kann die Nummer auch von Hand eintippen. |
| **Nicht an fremden QR-Codes herumscannen** | Nur deine eigene Karte zählt. |

### Was bedeuten die Farben auf dem Display?

| Farbe | Bedeutung |
| :--- | :--- |
| 🟡 **Gelb** | Ein Kind ist gerade auf der Toilette unterwegs. |
| 🟢 **Grün** | Alles in Ordnung – die Rückkehr wurde bestätigt. |
| 🔴 **Rot** | Ein Kind ist **länger als 10 Minuten** unterwegs. Die Lehrkraft schaut dann nach, ob alles okay ist. |

### Was, wenn meine Karte weg ist oder kaputt?

Kein Problem! Sag der Lehrkraft einfach deine Nummer – sie tippt sie auf dem
Nummernfeld ein (01 bis 30). Das funktioniert genau so wie der Scan.

---

## Teil 2: Für Lehrkräfte und die Schulleitung (Admin)

### Der Alltag – nichts zu tun

Das Terminal funktioniert von allein. Kinder scannen ein, das System
protokolliert Abgang und Rückkehr mit Uhrzeit. Es werden **keine Namen**
gespeichert – nur Nummern von 01 bis 30.

### Die vier Buttons oben rechts

| Button | Wofür? | Wann benutzt man ihn? |
| :--- | :--- | :--- |
| **QR-Karten drucken** | Erstellt einen Druckbogen mit 30 QR-Kärtchen (Klassenname + Nummer + Code `KLASSENCODE-NR`, z. B. `2B-05`). | Nur beim Schuljahresbeginn oder wenn Karten verloren gehen. Kärtchen ausschneiden, laminieren, auf Federmäppchen kleben. **Achtung:** Nach dem Ändern des Klassennamens müssen die Karten neu gedruckt werden. |
| **Sammel-QR für Admin** | Zeigt einen großen QR-Code mit **allen gespeicherten Toilettengängen** dieser Klasse – inklusive Datum, auch vergangener Tage. | Wenn die Schulleitung eine Gesamtübersicht über alle Klassen braucht (z. B. nach einem Vorfall). |
| **Schadens-Zeitfilter** | Filtert die heutigen Gänge nach einem **Zeitfenster**. | Wenn z. B. um 11:20 Uhr ein Papierkorb verstopft gefunden wird: Von–Bis-Zeit eingeben, und die App listet, welche Nummern in dieser Zeit draußen waren. |
| **Tagesdaten schreddern** | Löscht **alle** heutigen Zeitstempel sofort und unwiderruflich. | Am Ende des Schultags, wenn es **keine** Toilettenschäden gab. Datensparsamkeit: So wenig Daten wie möglich aufbewahren. |

### Wenn ein zweites Kind scanned, während schon eines draußen ist

Das System **blockiert** den Abgang und fragt die Lehrkraft:

> „Schüler/in #03 ist aktuell bereits unterwegs. Darf Schüler/in #14 ebenfalls zur Toilette?"

* **„Ja, darf gehen"** → Das zweite Kind wird freigegeben.
* **„Nein, warten lassen"** → Das Kind muss kurz warten.

So wird verhindert, dass sich zwei Kinder auf der Toilette verabreden.

### Die „Aktuell auf Toilette"-Liste

Zeigt live, wer draußen ist:

* **Gelbe Karte** mit Nummer, Abgangszeit und „Seit X Min. unterwegs"
* Ab **5 Minuten** (einstellbar) ertönt **einmalig** ein Warnton
* Ab **10 Minuten** wird die Karte **rot** mit „Bitte nachsehen!"
* Der Button **„Zurück"** an der Karte meldet das Kind per Hand zurück
  (falls die Karte vergessen wurde oder der Scan nicht klappt)

### Schnell-Tippfeld (01–30) – nur bei Bedarf einblendbar

* Das Nummernfeld ist **standardmäßig eingeklappt**, damit Kinder nicht
  versehentlich eine falsche Nummer antippen.
* Per Klick auf **„Einblenden"** öffnet die Lehrkraft das Feld mit den
  Tasten 01–30.
* Tasten von **abwesenden** Kindern leuchten gelb und pulsieren.
* Ein Tipp auf die Nummer wirkt wie ein Scan (Abgang bzw. Rückkehr).
* Nützlich, wenn ein Kind seine Karte vergessen hat.

### Klasse ändern

Klickt man oben auf den **Klassen-Button** (z. B. „Klasse 2b"), kann man
den Klassennamen anpassen – praktisch, wenn das iPad in eine andere Klasse
wandert oder ein neuer Jahrgang kommt. Der Name wird auf dem iPad
gespeichert und bleibt erhalten.

**Tipp für die IT (optional):** Beim allerersten Öffnen kann die Klasse
auch per URL vorgegeben werden, z. B.
`https://wc.schule.de/index.html?klasse=3a`
Das ist praktisch für Jamf-Webclips: Die IT legt pro iPad eine eigene URL
mit vorgegebenem Klassennamen an. Der Parameter gilt nur beim ersten
Start – danach kann die Lehrkraft den Namen wie gewohnt per Klick ändern.

### Sammel-QR für die Schulleitung – Schritt für Schritt

1. Auf dem Klassen-iPad **„Sammel-QR für Admin"** antippen.
2. Ein großer QR-Code erscheint auf dem Display.
3. Das **Admin-Gerät** der Schulleitung öffnet `admin_sync.html`
   (liegt auf demselben Server, z. B. `.../admin_sync.html`) und
   startet die Kamera.
4. Den QR-Code des iPads **in den Rahmen halten** – fertig.
5. Auf dem Admin-Gerät erscheinen alle Vorgänge dieser Klasse in einer
   Tabelle – mit **Datum**, Klasse, Nummer, Abgang, Rückkehr und Dauer.
   Sortiert wird nach Datum, dann Klasse, dann Uhrzeit. Das wird für
   **jede Klasse** wiederholt – die Daten sammeln sich zu einer
   Gesamtübersicht.

**Fallback:** Klappt die Kamera nicht, kann der QR-Code auch mit einer
beliebigen QR-Scan-App gelesen und der Text in das Textfeld
„Roh-Daten manuell einfügen" kopiert werden.

> **Hinweis:** Die Übertragung ist rein **optisch** – es werden keine
> Daten über das Internet oder ein Netzwerk zwischen den Geräten
> ausgetauscht. Der QR-Code zeigt nur Nummern und Uhrzeiten, niemals
> Namen.

### Die Einstellungen anpassen (für Neugierige)

In `index.html` gibt es zwei markierte Stellen:

| Stelle | Was ändert man? |
| :--- | :--- |
| Ganz oben im `<style>`-Bereich, Kommentar `HIER HINTERGRUNDFARBE ÄNDERN` | Die Hintergrundfarbe des Terminals (z. B. `#ffffff` für Weiß). |
| Im `<script>`-Block, Kommentar `HIER KANNST DU DIE APP LEICHT ANPASSEN` | `SCHOOL_NAME` (Schulname für Header, Druckbogen & Admin-QR), `ALLOWED_DOMAIN` (Domain-Sperre), `WARN_AFTER_MINUTES` (Warnton ab X Minuten, Standard 5), `OVERDUE_MINUTES` (roter Hinweis ab X Minuten, Standard 10) sowie `TOTAL_STUDENTS` (Anzahl Nummern, Standard 30). |
| Datei `schul-logo.png` im selben Ordner | Optionales Schul-Logo im Header. Fehlt die Datei, erscheint das 🚻-Symbol als Platzhalter. |

Nach dem Speichern der Datei muss sie nur noch auf den Schulserver
hochgeladen werden – die iPads laden die neue Version automatisch beim
nächsten Öffnen.

### Datenschutz auf einen Blick

* ✅ Keine Namen, keine Fotos, keine Videos – nur Nummern 01–30
* ✅ Alles bleibt auf dem einen iPad (localStorage), kein Server
* ✅ QR-Kamera ist nur ein „Lichtsensor" für den Code
* ✅ Manuelle Löschung per „Tagesdaten schreddern" am Tagesende
* ✅ Die Zuordnung Nummer → Kind liegt **nur** auf Papier im Pult der Klassenleitung
