# Projektdokumentation: Der digitale Toiletten-Pass
## Einfaches, sicheres Abmeldesystem für Grundschulklassen ohne Internet und ohne Server

---

### Inhaltsverzeichnis
1. **Worum geht es bei diesem Projekt? (Ziel & Zweck)**
2. **Wie funktioniert das System im Schulalltag?**
   * 2.1 Der normale Ablauf für die Kinder
   * 2.2 Schutzfunktion: Zweites Kind nur mit Lehrer-Bestätigung
   * 2.3 Nachmittags in der OGS
3. **Was steckt technisch drin? (Programmiersprachen & Aufbau)**
   * 3.1 Warum reicht je eine HTML-Datei pro Gerät?
   * 3.2 Eingesetzte Sprachen und Bibliotheken
   * 3.3 Wie und wo werden Daten gespeichert?
4. **Alle Funktionen im Detail**
   * 4.1 Die Kamera als QR-Scanner
   * 4.2 Akustische Töne und optische Signale
   * 4.3 Das 30er-Tippfeld (Touch-Alternative)
   * 4.4 Live-Timer und die 10-Minuten-Erinnerung
   * 4.5 Der integrierte Druckbogen für QR-Karten
   * 4.6 Der Schadens-Zeitfilter
   * 4.7 Bildschirm-zu-Bildschirm-Abruf (Sammel-QR für Admin)
   * 4.8 Manueller und automatischer Daten-Schredder
5. **Datenschutz: Warum Eltern und Schulleitung beruhigt sein können**
6. **Schritt-für-Schritt-Anleitung: Bereitstellung & Jamf School**
7. **Häufige Fragen aus dem Kollegium (FAQ)**
8. **Wie der Code funktioniert (Tutorial für Interessierte)**
   * 8.1 Die beiden Dateien und ihre Aufgaben
   * 8.2 Welche Sprache macht was?
   * 8.3 Der Aufbau von `toiletten_terminal.html` Schritt für Schritt
   * 8.4 Die wichtigsten JavaScript-Funktionen erklärt
   * 8.5 Die einstellbaren Konstanten (auch für Laien änderbar)
   * 8.6 Wie die Daten im Browser gespeichert werden
   * 8.7 Das Format des Admin-Sammel-QR-Codes
   * 8.8 `admin_sync.html`: Der Ausleser für die Schulleitung

---

## 1. Worum geht es bei diesem Projekt? (Ziel & Zweck)

In vielen Grundschulen kommt es auf den Schülertoiletten immer wieder zu mutwilligen Sachbeschädigungen: verstopfte Becken durch ganze Klopapierrollen, Schmierereien an Wänden oder abgerissene Halterungen. Wenn ein Schaden auffällt, lässt sich oft nicht mehr nachvollziehen, wann er entstanden ist und wer zu dieser Zeit unterwegs war.

Klassische Lösungen scheitern in der Praxis:
* **Analoge Papierlisten** an der Tür werden von den Kindern vergessen, gehen verloren oder stiften Verwirrung.
* **Elektronische Schließsysteme** an den Türen kosten tausende Euro, erfordern bauliche Maßnahmen und sind fehleranfällig.
* **Kameras vor den WCs** sind aus Datenschutzgründen an Schulen grundsätzlich verboten.

**Die Lösung:**  
Jede Klasse erhält auf ihrem vorhandenen Klassen-iPad eine kleine, kinderleichte App. Bevor ein Kind zur Toilette geht, hält es kurz seine persönliche Karte mit einem QR-Code vor das Display. Beim Zurückkommen scannt es noch einmal. So entsteht automatisch ein minutengenaues Zeitprotokoll – ganz ohne Klarnamen, ohne Internetverbindung und ohne fremde Server.

---

## 2. Wie funktioniert das System im Schulalltag?

Das iPad steht auf einem kleinen Pult oder einem Tisch nahe der Ausgangstür des Klassenzimmers. Der Bildschirm bleibt während der Unterrichtszeit dauerhaft an.

```
       [ SCHÜLER/IN ]
             |
             | (1. Scan beim Rausgehen)
             v
   +--------------------+
   |   KLASSEN-iPAD     | ---> Gelbes Banner: "Nr. 14 abgemeldet" (Heller Ton)
   | (Kamera / Display) |      Timer startet dezent im Hintergrund
   +--------------------+
             |
             | (2. Scan beim Wiederkommen)
             v
   +--------------------+
   |   KLASSEN-iPAD     | ---> Grünes Banner: "Nr. 14 zurück (4 Min.)" (Tiefer Ton)
   +--------------------+      Nummer verschwindet aus "Aktuell unterwegs"
```

### 2.1 Der normale Ablauf für die Kinder
1. **Rausgehen (Check-Out):**  
   Das Kind nimmt sein Federmäppchen, hält den aufgeklebten QR-Code kurz vor die Kamera des iPads. Das Gerät spielt einen kurzen, freundlichen Zweiklang ab, das Display zeigt groß: *„Nr. 14 abgemeldet – 10:14 Uhr“*. Das Kind geht zur Toilette.
2. **Wiederkommen (Check-In):**  
   Nach der Rückkehr hält das Kind die Karte erneut vor die Kamera. Ein tieferer Bestätigungston ertönt, und das Display meldet: *„Nr. 14 wieder da (Dauer: 4 Minuten)“*. Der Gang ist erledigt.

### 2.2 Schutzfunktion: Zweites Kind nur mit Lehrer-Bestätigung
Oft entstehen Schäden, wenn zwei Kinder gleichzeitig den Raum verlassen und sich auf der Toilette verabreden. Die App verhindert das automatisch:
* Ist bereits ein Kind unterwegs und ein zweites Kind scannt seine Karte, blockiert die App den direkten Abgang.
* Es öffnet sich sofort ein klares Hinweisfenster für die Lehrkraft:  
  *„Schüler/in #03 ist bereits auf dem WC. Darf Schüler/in #14 trotzdem gehen?“*
* **Ja, darf gehen:** Die Lehrkraft tippt auf Bestätigen, und das zweite Kind wird freigegeben.
* **Nein, warten lassen:** Das zweite Kind muss kurz warten, bis das erste Kind zurück ist.

### 2.3 Nachmittags in der OGS (Offene Ganztagsschule)
Am Nachmittag bewegen sich die Kinder oft frei zwischen Räumen. Hier wird keine neue Technik benötigt:
* Die ohnehin vorhandene **Plättchentafel** der OGS (wo Kinder ihr Namensplättchen in die Spalte ihres Aufenthaltsraums schieben) erhält eine zusätzliche Spalte: **„WC / Toilette“**.
* Feste OGS-Regel: **Es dürfen maximal 2 Plättchen gleichzeitig im WC-Feld liegen.**
* Das verhindert Gruppenbildungen am Nachmittag auf vollkommen unkomplizierte, analoge Weise.

---

## 3. Was steckt technisch drin? (Programmiersprachen & Aufbau)

Obwohl die App viele Aufgaben übernimmt (Kamera-Erkennung, Töne, Live-Timer, Druckvorschau, Schadensfilter), steckt die gesamte Programmierlogik des Terminals in **einer einzigen HTML-Datei: `toiletten_terminal.html`**. Das Projekt besteht aus **zwei selbst programmierten HTML-Dateien** – das Klassen-Terminal und `admin_sync.html` für die Schulleitung (liest die Sammel-QRs der Klassen aus). Daneben liegen nur noch **Bibliotheks-Dateien** (`tailwind.js`, `qrcode.min.js`, `html5-qrcode.min.js`), der **Offline-Cache** (`sw.js`), das **App-Manifest** (`manifest.webmanifest`) und `robots.txt` im selben Ordner – allesamt fertige, nicht selbst programmierte Bausteine.

### 3.1 Warum reicht je eine HTML-Datei pro Gerät?
Moderne Web-Browser auf dem iPad (Safari) sind vollwertige Anwendungsplattformen. Eine HTML-Datei kann neben Text auch Gestaltungsvorschriften (CSS), Programmlogik (JavaScript), Töne und Bildverarbeitung direkt in sich vereinen. Es wird keine Installation aus dem Apple App Store benötigt und kein Datenbank-Server im Hintergrund. Das Terminal (`toiletten_terminal.html`) läuft auf **jedem** Klassen-iPad – derselbe File, aber jeder Browser speichert seine Daten getrennt (`localStorage`). Die zweite Datei (`admin_sync.html`) wird nur auf dem Gerät der Schulleitung geöffnet und dient ausschließlich dem Auslesen der optisch übertragenen Sammel-QRs.

### 3.2 Eingesetzte Sprachen und Bibliotheken
Alle verwendeten Technologien sind lizenzkostenfrei (Open Source) und erfordern keine Abonnements:

| Baustein | Technologie | Wofür wird es gebraucht? |
| :--- | :--- | :--- |
| **Grundgerüst** | **HTML5** | Erstellt die Struktur: Buttons, Listen, Tabellen, Videofenster und Eingabefelder. |
| **Design & Farben** | **Tailwind CSS** (`tailwind.js`, lokal) | Sorgt für das moderne, saubere Aussehen mit abgerundeten Karten, Schatten und gut lesbarer Schrift. |
| **Programmlogik** | **JavaScript (ES6+)** | Berechnet Zeiten, prüft ob jemand draußen ist, reagiert auf Klicks und steuert den Ablauf. |
| **Kamera & Scan** | **Html5-QRCode** (`html5-qrcode.min.js`, lokal) | Erkennt QR-Codes über die iPad-Kamera (bevorzugt die **hintere** Kamera) direkt im Arbeitsspeicher des Geräts (kein Bild verlässt das iPad). |
| **QR-Code-Erzeugung** | **QRCode.js** (`qrcode.min.js`, lokal) | Zeichnet die scharfen QR-Codes für den Druckbogen sowie den Sammel-Code für den Admin-Abruf. |
| **Töne & Signalton** | **Web Audio API** | Erzeugt Töne rein rechnerisch über den Lautsprecher – ganz ohne MP3-Dateien herunterladen zu müssen. |
| **Offline-Fähigkeit** | **Service Worker** (`sw.js`) | Legt App + alle Bibliotheken im Browser-Cache ab. Nach dem ersten Laden mit Netz funktioniert alles **auch bei komplettem WLAN-Ausfall**. |
| **App-Gefühl** | **Web App Manifest** (`manifest.webmanifest`) + Meta-Tags | Lässt den Jamf-Webclip wie eine native App aussehen (eigener Name, Vollbild ohne Browserleiste). |

**Wichtig:** Alle Bibliotheken liegen **lokal im selben Ordner** auf dem Schulserver – es gibt keine Abhängigkeit zu externen CDNs (kein jsdelivr, kein Tailwind-CDN). Das ist absichtlich so: Es funktioniert auch dann, wenn das Schul-WLAN mal ganz ausfällt oder ein CDN nicht erreichbar ist.

### 3.3 Wie und wo werden Daten gespeichert?
Die App nutzt den standardisierten Browser-Speicher **`localStorage`**:
* Alle Zeiten werden direkt auf dem Flash-Speicher des einzelnen iPads abgelegt.
* Es gibt **keine Cloud**, keinen Webserver, der Daten sammelt, und keine Internetverbindung, die Daten nach außen sendet.
* Fällt das Schul-WLAN komplett aus oder wird das iPad vom Netz getrennt, funktioniert die Erfassung ungestört weiter.

---

## 4. Alle Funktionen im Detail

### 4.1 Die Kamera als QR-Scanner
Über den Button *„📷 Kamera starten“* aktiviert die App die Kamera – **bevorzugt die hintere Kamera** (`environment`, höhere Auflösung und besserer Fokus auf QR-Codes), mit automatischem Fallback auf die Frontkamera (`user`). Im Display erscheint ein dezenter Zielrahmen. Sobald eine Schülerkarte in die Nähe gehalten wird:
* Erkennt die Software den Code in Bruchteilen einer Sekunde.
* Ein Schutzfilter (2,5 Sekunden Sperre) verhindert, dass eine Karte versehentlich doppelt gescannt wird.
* **Klassenprüfung:** Die QR-Codes enthalten eine **Klassenkennung** (z. B. `2B-05` für „Klasse 2b", Nr. 05). Scannt ein Kind eine Karte, die zu einer anderen Klasse gehört, erscheint eine **Warnung** („Karte gehört zu einer anderen Klasse") und es wird **kein Eintrag** erstellt. So können die Nummern 01–30 sauber pro Klasse getrennt bleiben. Karten mit nur der Nummer (`05`) – z. B. von Hand nachgedruckt – werden weiterhin akzeptiert.

### 4.2 Akustische Töne und optische Signale
* **Aufbruch:** Ein heller Zweiklang (wie an der Kasse oder am Bahnhof) bestätigt, dass der Gang gebucht ist. Das Banner leuchtet gelb.
* **Rückkehr:** Ein tieferer, satter Bestätigungston signalisiert die erfolgreiche Rückkehr. Das Banner leuchtet grün.
* **Warnung:** Bei unberechtigtem Scan oder wenn bereits jemand draußen ist, ertönt ein dezenter Warnton.
* **Großes Bildschirm-Symbol:** Bei jedem Scan **und** bei manueller Nummerneingabe erscheint zusätzlich ca. 1,6 Sekunden lang ein großes Symbol in der Bildschirmmitte – 🚪 „Raus!" (amber) beim Abgang, ↩️ „Zurück!" (grün) bei der Rückkehr, ⚠️ „Moment!" (rot) bei Warnungen. So sehen auch Kinder aus größerer Entfernung sofort, ob der Scan geklappt hat.

### 4.3 Das 30er-Tippfeld (Touch-Alternative)
Unter dem Scan-Terminal befindet sich ein einklappbares Nummernfeld mit den Tasten `01` bis `30`:
* **Standardmäßig ausgeblendet** – Kinder sollen nicht versehentlich eine falsche Nummer antippen. Die Lehrkraft blendet es bei Bedarf per Klick auf *„Einblenden"* ein.
* Hat ein Kind seine Karte vergessen oder ist sie verknickt, tippt die Lehrkraft oder das Kind einfach auf seine Nummer.
* Tasten von Kindern, die gerade draußen sind, leuchten gelb auf und pulsieren leicht. So sieht man auf einen Blick, wer unterwegs ist.

### 4.4 Live-Timer und die 10-Minuten-Erinnerung
In der rechten Spalte listet das Terminal alle Kinder auf, die aktuell den Raum verlassen haben:
* Ein Zähler zeigt die Minuten an (*„Seit 3 Min. unterwegs“*).
* **Akustische Langzeit-Warnung:** Bleibt ein Kind länger als eine einstellbare Zeit (`WARN_AFTER_MINUTES`, Standard: 5 Minuten) auf der Toilette, ertönt **einmalig** ein dezenter Warnton. Die Lehrkraft hört sofort, dass jemand auffällig lange unterwegs ist – auch wenn sie gerade nicht auf den Bildschirm schaut.
* **Optischer Hinweis:** Ab `OVERDUE_MINUTES` (Standard: 10 Minuten) färbt sich der Kasten rot mit dem dezenten Hinweis *„⚠️ Bitte nachsehen!“*. So wird die Lehrkraft aufmerksam, falls einem Kind übel ist oder es sich verletzt hat.
* Beide Zeitwerte lassen sich ganz oben im Code-Block `/* >>> HIER KANNST DU DIE APP LEICHT ANPASSEN <<< */` mit zwei einfachen Zahlen anpassen – kein Programmierwissen nötig.

### 4.5 Der integrierte Druckbogen für QR-Karten
Ein Klick auf *„QR-Karten drucken“* öffnet eine fertige Vorlage für 30 Kärtchen:
* Jedes Kärtchen enthält die **Klasse** (z. B. „Klasse 2b"), die Nummer (`ID: 04`), einen scharfen QR-Code im Format `KLASSENCODE-Nummer` (z. B. `2B-04`) und den Vermerk *„Streng pseudonym – keine Namen notieren“*. Der **Schulname** steht zusätzlich im Kopf des Druckbogens.
* Im Header der App erscheint der Schulname (`SCHOOL_NAME`) sowie optional das Schul-Logo (`schul-logo.png` – fehlt die Datei, erscheint der „WC"-Platzhalter).
* Über den Button *„Jetzt Drucken“* wird die Seite sauber auf DIN-A4 formatiert an den Schul-Drucker gesendet.
* Die Kärtchen werden ausgeschnitten, laminiert und auf das Federmäppchen geklebt.
* **Wichtig:** Der Klassencode im QR wird aus dem aktuellen Klassennamen abgeleitet (z. B. „Klasse 2b" → `2B`). Wird die Klasse später umbenannt, müssen die Karten neu gedruckt werden – sonst werden sie als „fremde Klasse" abgelehnt.

### 4.6 Der Schadens-Zeitfilter
Wird um 11:20 Uhr festgestellt, dass auf der Toilette ein Papierkorb angezündet oder ein Waschbecken verstopft wurde:
1. Lehrkraft öffnet den Button *„Schadens-Zeitfilter“*.
2. Sie gibt das geschätzte Zeitfenster ein (z. B. von `10:30` bis `11:15` Uhr).
3. Die App gleicht alle heutigen Gänge ab und zeigt sofort an:  
   *„3 Schülernummern waren in diesem Zeitraum draußen: Nr. 03, Nr. 14, Nr. 22.“*
4. Die Lehrkraft schaut in ihre handschriftliche Liste im Lehrerpult und kann den Vorfall ruhig und gezielt mit den betreffenden Kindern besprechen.

### 4.7 Bildschirm-zu-Bildschirm-Abruf (Sammel-QR für Admin)
Wenn ein Toilettentrakt von mehreren Klassen genutzt wird und die Schulleitung wissen muss, wer aus der gesamten Schule unterwegs war:
* Es müssen **keine E-Mails verschickt** werden.
* Auf dem Klassen-iPad tippt man auf *„Sammel-QR für Admin“*.
* Die App packt alle gespeicherten Zeiten **aller Tage** (gruppiert nach Datum) in einen einzigen, hochdichten QR-Code auf dem Display.
* Die Schulleitung öffnet die zweite Datei **`admin_sync.html`** auf ihrem Dienstgerät (z. B. `https://wc.ggssteinberg.de/admin_sync.html`) und scannt den Bildschirm-Code damit ab (dauert 3 Sekunden). Das Gerät zeigt die Vorgänge aller Klassen zu einer Gesamtübersicht zusammen.
* So werden die Daten mehrerer Klassen ohne Netzwerkverbindung zwischen den Geräten zusammengetragen. Läuft die Kamera einmal nicht, kann der QR-Code auch mit einer beliebigen QR-App gescannt und der Text in `admin_sync.html` eingefügt werden.

### 4.8 Manueller Daten-Schredder
* **Manuell:** Gab es am Vormittag keine Vorkommnisse, kann die Lehrkraft zum Unterrichtsende auf *„Tagesdaten schreddern“* tippen. Alle Zeitstempel werden sofort rückstandslos gelöscht.
* **Bewusst kein Auto-Reset:** Es gibt bewusst **keine** automatische nächtliche Löschung mehr. Solange niemand die Daten löscht, bleiben sie erhalten – so gehen auch Vorkommnisse vom späten Nachmittag nicht verloren. Die Löschung liegt in der Verantwortung der Lehrkraft (DSGVO: Speicherfrist selbst festlegen).

---

## 5. Datenschutz: Warum Eltern und Schulleitung beruhigt sein können

Das System wurde nach dem Grundsatz der **Datensparsamkeit gem. Art. 5 DSGVO** und den Vorgaben des Schulgesetzes NRW (§ 120 SchulG) entworfen:

1. **Keine Klarnamen im System:**  
   Die App speichert weder Namen noch Klassenlisten. Sie kennt ausschließlich anonyme Zahlen (`01`, `02`, `03` ...).
2. **Die Konkordanzliste bleibt auf Papier:**  
   Welches Kind welche Nummer hat, steht nur auf einem einzigen Blatt Papier, das im verschlossenen Pult der Klassenleitung liegt. Weder die Schulleitung noch die IT-Betreuung haben darauf Zugriff.
3. **Keine Gesichtserkennung:**  
   Die Kamera nimmt keine Videos auf und speichert keine Fotos. Sie fungiert ausschließlich als Lichtsensor, um die schwarzen und weißen Vierecke des QR-Codes zu entziffern.
4. **Keine Leistungskontrolle:**  
   Die App enthält bewusst keine Wochenstatistiken (*„Wer geht wie oft im Monat?“*), um jede Form von Verhaltensüberwachung technisch unmöglich zu machen.

---

## 6. Schritt-für-Schritt-Anleitung: Bereitstellung & Jamf School

Die Einführung erfordert nur wenige Handgriffe und verursacht **0 € laufende Kosten**:

```
+-------------------------------------------------------------------------------+
| SCHRITT 1: HOSTING                                                            |
| Eine Subdomain anlegen (z. B. wc.ggssteinberg.de) oder einen Ordner /wc/      |
| auf dem Schul-Webspace erstellen. ALLE Dateien des Ordners per FTP          |
| hochladen: toiletten_terminal.html, admin_sync.html, tailwind.js,          |
| qrcode.min.js, html5-qrcode.min.js, sw.js, manifest.webmanifest.           |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| SCHRITT 2: JAMF SCHOOL (MDM)                                                  |
| Unter 'Apps -> Webclips' einen neuen Webclip anlegen:                         |
| - URL: https://wc.ggssteinberg.de/toiletten_terminal.html                     |
|   (Optional pro Klasse: ?klasse=2b anhängen, z. B.                           |
|    .../toiletten_terminal.html?klasse=2b – legt den Klassennamen             |
|    nur beim allerersten Start fest)                                          |
| - Vollbildmodus: AKTIVIERT (keine Safari-Leiste sichtbar)                    |
| - Ziel: Allen 8 Klassen-iPads zuweisen.                                       |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| SCHRITT 3: BEDIENUNG IM KLASSENRAUM                                           |
| Auf dem iPad das neue Icon antippen. Einmalig Kamera-Zugriff erlauben.        |
| 'Geführten Zugriff' am iPad aktivieren, damit Kinder die App nicht schließen. |
+-------------------------------------------------------------------------------+
```

---

## 7. Häufige Fragen aus dem Kollegium (FAQ)

**Was passiert, wenn ein Kind dringend muss und keine Zeit zum Scannen ist?**  
Gesundheit und Würde gehen immer vor. Das Kind darf sofort loslaufen. Die Lehrkraft oder ein Nachbarkind tippt die Nummer einfach kurz auf dem Tippfeld an.

**Verbraucht die App viel Akku auf dem iPad?**  
Nein. Die App ist extrem schlank programmiert. Wenn das iPad an einem gewöhnlichen Ladekabel angeschlossen ist, bleibt der Akkustand den ganzen Tag bei 100 %.

**Kann man die Hintergrundfarbe anpassen?**  
Ja. In der Datei `toiletten_terminal.html` ist der Kommentar `/* --- HIER HINTERGRUNDFARBE ÄNDERN --- */` markiert. Dort kann der Farbcode (z. B. `#ffffff` für Weiß oder `#f8fafc` für Hellgrau) mit einem Texteditor frei gewählt werden.

**Müssen wir bei jedem Schuljahreswechsel alles neu einrichten?**  
Nein. Die iPads und die Web-Adresse bleiben identisch. Die neue Klasse druckt sich am ersten Schultag über den Button einfach einen neuen Satz Kärtchen aus – fertig.

---

## 8. Wie der Code funktioniert (Tutorial für Interessierte)

Dieser Abschnitt erklärt die Technik so, dass auch Menschen ohne Programmierkenntnisse verstehen, was in den Dateien passiert. Er richtet sich an Lehrkräfte, die dem IT-Beauftragten oder einer interessierten Elternschaft erklären möchten, was die App genau tut.

### 8.1 Die beiden Dateien und ihre Aufgaben

| Datei | Wer benutzt sie? | Aufgabe |
| :--- | :--- | :--- |
| **`toiletten_terminal.html`** | Lehrkraft / iPad im Klassenzimmer | Das eigentliche Terminal: scannen, buchen, anzeigen, drucken, filtern, schreddern. |
| **`admin_sync.html`** | Schulleitung / IT auf einem anderen Gerät | Liest den Sammel-QR der Klassen-Terminals aus und zeigt eine Gesamtübersicht. |
| **`tailwind.js`, `qrcode.min.js`, `html5-qrcode.min.js`** | (automatisch geladen) | Fertige Open-Source-Bibliotheken – bewusst **lokal** gespeichert, damit die App auch ohne Internet funktioniert. |
| **`sw.js`** | (automatisch im Hintergrund) | Service Worker: Cached alle Dateien im Gerät, damit die App ab dem zweiten Laden komplett offline läuft. |
| **`manifest.webmanifest`** | (optional) | declaring den „App-Namen" für den Jamf-Webclip (WC-Pass / WC-Admin). |
| **`schul-logo.png`** | (optional) | Schul-Logo im Header. Fehlt die Datei, erscheint automatisch das 🚻-Symbol als Platzhalter. |

**Wichtig:** Alle Dateien müssen **im selben Ordner** auf dem Schulserver liegen, sonst findet der Browser die Bibliotheken und den Service Worker nicht.

Beide Dateien sind **reine Textdateien** – sie bestehen nur aus lesbaren Zeichen und brauchen keinerlei Installation. Ein Browser (Safari auf dem iPad) interpretiert sie automatisch.

### 8.2 Welche Sprache macht was?

Eine HTML-Datei ist wie ein Brief mit drei Umschlägen. Jeder Umschlag hat eine eigene „Sprache":

| Baustein | Sprache | Was er tut (einfach erklärt) |
| :--- | :--- | :--- |
| **HTML** | Hypertext Markup Language | Das Skelett: Wo sind Buttons, Listen, Tabellen und Eingabefelder? |
| **CSS / Tailwind CSS** | Cascading Style Sheets | Das Aussehen: Farben, Abstände, runde Ecken, Schatten. Tailwind ist eine Bibliothek, die fertige Design-Bausteine liefert – hier in der lokalen Datei `tailwind.js`. |
| **JavaScript** | ECMAScript (ES6+) | Das Gehirn: Rechnet Zeiten, reagiert auf Klicks, startet die Kamera, erzeugt Töne. |
| **Html5-QRCode** | JavaScript-Bibliothek (Open Source) | Schaut in den Kamerabildern nach schwarzen QR-Code-Ecken und liest die Nummer aus. |
| **QRCode.js** | JavaScript-Bibliothek (Open Source) | Zeichnet umgekehrt aus einer Nummer einen QR-Code (für die Druckkärtchen und den Sammel-QR). |
| **Web Audio API** | Browser-eigene Technik | Erzeugt Töne direkt per Mathematik – keine Soundsdateien nötig. |

**Wichtig zu wissen:** Alle Bibliotheken liegen **lokal auf dem Schulserver** (keine externen CDNs). Das iPad braucht Internet also nur beim **allerersten Öffnen**. Danach legt der Service Worker (`sw.js`) alles im Gerätespeicher ab – die App läuft ab dann **auch bei komplettem WLAN-Ausfall** weiter. Tipp für die Bereitstellung: Jedes iPad einmalig mit Netz öffnen, dann ist es für immer offline-tauglich.

### 8.3 Der Aufbau von `toiletten_terminal.html` Schritt für Schritt

Die Datei ist von oben nach unten in vier klar getrennte Zonen aufgeteilt:

#### Zone 1: Der `<head>`-Bereich (Zeilen ca. 3–72) – „Kopf" der Datei

```html
<head>
    <meta charset="UTF-8">          <!-- Sorgt dafür, dass Umlaute (ä, ö, ü) richtig angezeigt werden -->
    <title>Toiletten-Pass | ...</title>
    <link rel="manifest" href="manifest.webmanifest">   <!-- App-Manifest -->
    <script src="tailwind.js"></script>                  <!-- Design-Bibliothek (lokal) -->
    <script src="qrcode.min.js"></script>                <!-- QR-Code-Zeichner (lokal) -->
    <script src="html5-qrcode.min.js"></script>          <!-- QR-Code-Leser (lokal) -->
    <script>navigator.serviceWorker.register('sw.js')</script>  <!-- Offline-Cache -->
    <style> ... </style>                                         <!-- Hintergrundfarbe & Druckregeln -->
</head>
```

*Der `<head>` enthält alles, was **vor** dem sichtbaren Inhalt geladen werden muss: Schriften, Bibliotheken, Farbeinstellungen.*

#### Zone 2: Der `<body>`-Bereich (Zeilen ca. 73–443) – „Was man sieht"

Hier steht das komplette **Skelett der Benutzeroberfläche** in HTML. Man erkennt es an den passenden Schlagworten:

| HTML-Bereich | Was dort steht |
| :--- | :--- |
| `<header>...</header>` | Die obere Leiste mit Titel, Klassen-Button und den 4 Aktions-Buttons (Drucken, Admin-QR, Zeitfilter, Schreddern). |
| `<main>...</main>` | Der Hauptteil in zwei Spalten: **links** Scan-Eingabe + Tippfeld, **rechts** „Aktuell draußen" + Tagesprotokoll. |
| `<div id="modal-...">` | Fünf **Fenster** (Modals), die nur bei Bedarf aufpoppen: Admin-QR, Zeitfilter, Schredder, Druckvorschau, Lehrer-Bestätigung. Sie sind mit `class="hidden"` unsichtbar, bis JavaScript sie einblendet. |
| `<div id="printable-cards-container">` | Ein unsichtbarer Bereich, der **nur beim Drucken** sichtbar wird (siehe Druck-CSS). |

**Merksatz:** Die `id="..."`-Namen (z. B. `id="scan-input"`, `id="history-table-body"`) sind die **Anschlüsse**, über die das JavaScript später die Elemente findet und verändert. Wer eine Beschriftung ändern will, sucht einfach nach dem Text im HTML-Teil.

#### Zone 3: Der große `<script>`-Block (Zeilen ca. 445–Ende) – „Das Gehirn"

Hier steht **die gesamte Programmierlogik** in JavaScript. Er ist in Abschnitte mit Kommentar-Trennern unterteilt:

```
STATE MANAGEMENT        → Variablen & Konstanten (Speicher-Schlüssel, 30 Schüler, einstellbare Zeiten)
WEB AUDIO API           → playScanBeep(): erzeugt die drei Töne
INITIALISIERUNG         →DOMContentLoaded: was beim Öffnen der Seite passiert
SCAN-LOGIK              → processNumberScan(), executeCheckout(), Lehrer-Bestätigung
FEEDBACK BANNER         → showFeedback(): das gelbe/grüne Meldungsfenster
RENDERING               → renderAll() und Helfer: baut die Listen & Buttons neu
KAMERA-MODUS            → toggleCameraView(): startet/stoppt die Kamera
SAMMEL-QR FÜR ADMIN     → openAdminSyncModal(): packt den Tag in einen QR-Code
SCHADENS-ZEITFILTER     → runInvestigationFilter(): vergleicht Zeitfenster mit Gängen
TAGESDATEN SCHREDDERN   → confirmShredData(): löscht alles
QR-CODE-DRUCKBOGEN      → generateQrCards(): erzeugt 30 Kärtchen-Vorschauen
```

### 8.4 Die wichtigsten JavaScript-Funktionen erklärt

| Funktion | Was sie macht (in Laiensprache) |
| :--- | :--- |
| `processNumberScan(rawVal)` | **Das Herzstück.** Nimmt eine gescannte oder getippte Nummer entgegen und entscheidet: Ist das Kind schon draußen? → **Check-in** (Rückkehr). Ist es drinnen? → **Check-out** (Abgang) – oder, falls schon ein Kind draußen ist, die **Lehrer-Bestätigung** öffnen. Prüft vorher per `parseScanInput()`, ob die Karte zur richtigen Klasse gehört. |
| `toClassToken(str)` / `getClassToken()` | Wandelt den Klassennamen in einen kurzen Code um („Klasse 2b" → `2B`) – dieser steht im QR-Code der Karten. |
| `parseScanInput(raw)` | Zerlegt einen Scan in Nummer + Klassenkennung (`2B-05` → Nummer `05`, Token `2B`). Erkennt, ob die Karte zu einer fremden Klasse gehört. |
| `normalizeNumber(raw)` | Räumt die Eingabe auf: Entfernt Präfixe wie `ID:` oder `2B-`, macht aus `3` die Nummer `03` und prüft, ob die Nummer zwischen 1 und 30 liegt. |
| `executeCheckout(num)` | Legt einen neuen „Abgang" an (mit aktuellem Datum/Uhrzeit), spielt den hohen Ton, zeigt das gelbe Banner und speichert alles. |
| `checkLongAbsence()` | Läuft alle 10 Sekunden mit. Prüft, ob ein Kind länger als `WARN_AFTER_MINUTES` unterwegs ist – dann ertönt **einmalig** der Warnton. |
| `renderActiveList()` | Baut die „Aktuell auf Toilette"-Karten neu:elapsed Zeit, rote Färbung ab `OVERDUE_MINUTES`, Schaltfläche „Zurück". |
| `renderHistoryTable()` | Baut die Tabelle des Tagesprotokolls: Abgang, Rückkehr, Dauer, Status. |
| `renderQuickGrid()` / `updateQuickButtonsStatus()` | Erzeugt die 30 Tasten und markiert die Tasten der gerade abwesenden Kinder gelb pulsierend. |
| `toggleNumberPad()` | Klappt das Nummernfeld ein/aus – es ist standardmäßig ausgeblendet, damit Kinder nicht versehentlich tippen. |
| `toggleCameraView()` | Startet die Kamera – bevorzugt `facingMode: "environment"` (hintere Kamera), Fallback `"user"` (Frontkamera) – oder stoppt sie. |
| `openAdminSyncModal()` | Sammelt alle gespeicherten Gänge **gruppiert nach Datum**, wandelt sie in einen kompakten Text um (`V3;Schule;Klasse;JJJJMMTT:...`) und erzeugt daraus einen QR-Code auf dem Bildschirm. |
| `runInvestigationFilter()` | Nimmt Start-/Endzeit entgegen und listet alle Nummern, deren Aufenthalt sich mit dem Zeitfenster überschneidet – der „Wer war wann draußen"-Filter. |
| `confirmShredData()` | Setzt beide Listen zurück und löscht den Speicher-Eintrag komplett. |
| `generateQrCards()` | Zeichnet 30 QR-Codes zweimal: klein für die Druckvorschau im Fenster, größer für den Druckbogen. |
| `playScanBeep(type)` | Erzeugt per Web Audio API drei Töne: `'out'` (aufsteigend = Abgang), `'in'` (absteigend = Rückkehr), `'warn'` (Sägezahn = Warnung). |

### 8.5 Die einstellbaren Konstanten (auch für Laien änderbar)

Ganz oben im `<script>`-Block steht ein markierter Block `/* >>> HIER KANNST DU DIE APP LEICHT ANPASSEN <<< */`:

| Konstante | Standard | Bedeutung |
| :--- | :--- | :--- |
| `TOTAL_STUDENTS` | `30` | Anzahl der Nummern (Tastenfeld & Druckkärtchen). |
| `WARN_AFTER_MINUTES` | `5` | Ab wann der akustische Warnton ertönt (einmalig pro Gang). |
| `OVERDUE_MINUTES` | `10` | Ab wann der rote „Bitte nachsehen!"-Hinweis erscheint. |
| `SCHOOL_NAME` | `'GGS Steinberg'` | Schulname – erscheint im Header, auf dem Druckbogen und wird in den Admin-QR eingebettet. |
| `ALLOWED_DOMAIN` | `'wcguard.schule.de'` | Domain-Sperre: Die App funktioniert nur auf dieser Domain (plus localhost, privaten IPs für Tests und `*.trycloudflare.com`). Auf fremden Domains erscheint nur ein Sperrhinweis – Kopierschutz. |

Zusätzlich lässt sich die **Hintergrundfarbe** im `<style>`-Bereich ändern (Kommentar `/* --- HIER HINTERGRUNDFARBE ÄNDERN --- */`). Alle Werte sind schlichte Zahlen bzw. Farbwerte – einfach den Wert zwischen den Anführungszeichen/der Zuweisung ändern, speichern, auf den Server laden, fertig.

### 8.6 Wie die Daten im Browser gespeichert werden

Die App nutzt `localStorage` – einen Speicherbereich, den jeder Browser fest eingebaut hat. Es werden **nur drei Schlüssel** verwendet:

```javascript
STORAGE_KEY = 'school_toilet_sessions_v1'   // alle Abgänge & Rückkehrzeiten des Tages
CLASS_KEY    = 'school_toilet_class_v1'      // z. B. "Klasse 2b"
```

Ein typischer Eintrag in `school_toilet_sessions_v1` sieht so aus (JSON-Text):

```json
{
  "active":   [{ "id": "session_...", "number": "03", "checkoutTime": "2026-11-06T10:14:00", "warnedLongAway": true }],
  "completed":[{ "id": "session_...", "number": "14", "checkoutTime": "...", "checkinTime": "...", "durationMinutes": 4 }]
}
```

* `active` = Kinder, die gerade draußen sind. `completed` = fertige Gänge (neueste zuerst). `warnedLongAway` merkt sich, dass der Warnton schon gespielt wurde.
* **Es gibt keinen Auto-Reset mehr:** Die Daten bleiben erhalten, bis jemand auf „Tagesdaten schreddern" tippt. Das ist eine datenschutzrechtliche Entscheidung – die Schule legt die Speicherfrist selbst fest.
* Die Daten verlassen das iPad **nie** – außer als QR-Code auf dem Bildschirm für die Schulleitung (optisch, also „Air-Gap").

### 8.7 Das Format des Admin-Sammel-QR-Codes

Der QR-Code auf dem Admin-Button ist kein normales Foto oder Video, sondern ein **komprimierter Text**. Er wird in `openAdminSyncModal()` so gebaut:

```
V3;Schule X;Klasse 2b;20261110:03:1014:1022#14:1110:9999;20261111:07:0905:0912
 │   │        │          │      │       │
 │   │        │          │      │       └─ Rückkehrzeit HHMM (9999 = noch draußen)
 │   │        │          │      └───────── Abgangszeit HHMM
 │   │        │          └──────────────── Schülernummer
 │   │        │   ┌─────────────────────── Trennzeichen zwischen den Gängen (#)
 │   │        └───┴─────────────────────── Datum JJJJMMTT + ":" (gilt für alle Gänge des Tages)
 │   └──────────────────────────────────── Klassenname
 └──────────────────────────────────────── Versionskennung V3 + Schulname
```

* `V3` = Format-Version. `admin_sync.html` kann **V3** (Schule + Klasse + Datum), **V2** (Klasse + Datum) und alte **V1**-Codes (nur Uhrzeit) lesen.
* Der Schulname ist fest eingebettet – er erscheint in der Admin-Übersicht als eigene Spalte und markiert die Daten als „eure" App.
* Die Gänge sind **nach Datum gruppiert**: Pro Tag steht einmal `JJJJMMTT:`, gefolgt von den Gängen dieses Tages (`#`-getrennt). So bleibt der QR-Code auch über viele Tage klein und lesbar.
* Jeder Gang ist `Nummer:Abgang:Ankunft` – bewusst ohne Namen.
* `9999` als Ankunft bedeutet: Das Kind ist **noch draußen**.
* Mehrere Klassen werden nicht in einem QR gemischt – jede Klasse zeigt ihren eigenen Code; `admin_sync.html` sammelt die einzelnen Codes zu einer Liste.

### 8.8 `admin_sync.html`: Der Ausleser für die Schulleitung

Die zweite Datei ist bewusst **klein und einfach** gehalten:

1. **Kamera-Scan:** Die Datei lädt `html5-qrcode` (Rückkamera) und liest den `V1;...`-, `V2;...`- oder `V3;...`-String vom Bildschirm des Klassen-iPads.
2. **Manueller Fallback:** Ein Textfeld akzeptiert denselben String per Einfügen – falls die Kamera z. B. am Mac kein QR lesen kann.
3. **Parser `parsePayload()`:** Zerlegt den String an `;`, `#` und `:` in einzelne Datensätze (`Klasse`, `Datum`, `Nummer`, `Abgang`, `Ankunft`).
4. **Merge mit Deduplizierung:** Jeder Vorgang bekommt einen Schlüssel `Klasse|Datum|Nummer|Abgang`. Scannt man dieselbe Klasse zweimal, entstehen **keine** Duplikate.
5. **Speicherung:** Die gesammelten Daten liegen in `localStorage` unter `admin_sync_events_v1` – sie bleiben erhalten und können mit „Alles löschen" entfernt werden.
6. **Anzeige:** Eine Tabelle sortiert nach **Datum**, Schule, Klasse und Uhrzeit zeigt Datum, Schule, Klasse, Abgang, Rückkehr, berechnete Dauer (Std./Min.) und Status („Draußen" bei `9999`).

**Warum zwei Dateien?** Die Trennung ist bewusst: Das Klassen-iPad soll maximal einfach und klein sein (nur 30 Nummern, kein Synchronisations-Code). Die Schulleitung bekommt ein eigenes Werkzeug, das mehrere Klassen-QRs nacheinander einsammelt – ohne dass die Klassen-Terminals miteinander kommunizieren müssen.