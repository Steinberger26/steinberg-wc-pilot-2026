// ============================================================
// SERVICE WORKER – macht die App offline-fähig
// ============================================================
// Was das ist: Eine kleine Helfer-Datei, die der Browser im
// Hintergrund laufen lässt. Sie legt eine Kopie der App und
// aller Bibliotheken im Gerätespeicher ab. Ab dem zweiten
// Öffnen funktioniert alles AUCH OHNE WLAN.
//
// WICHTIG: sw.js muss im selben Ordner wie die HTML-Dateien
// liegen, sonst funktioniert der Cache nicht.
// ============================================================

// Versionsname: Bei jeder Änderung an den Dateien hier hochzählen
// (z. B. v1 → v2), damit alte Caches automatisch ersetzt werden.
const CACHE_NAME = 'kloguard-v6';

// Diese Dateien werden beim ersten Start komplett gespeichert.
const ASSETS = [
    './',
    './index.html',
    './admin_sync.html',
    './tailwind.js',
    './qrcode.min.js',
    './html5-qrcode.min.js',
    './manifest.webmanifest',
    './robots.txt'
];

// ------------------------------------------------------------
// 1. INSTALLIEREN: Alle Dateien in den Cache legen
// ------------------------------------------------------------
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ------------------------------------------------------------
// 2. AKTIVIEREN: alte Caches aufräumen
// ------------------------------------------------------------
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// ------------------------------------------------------------
// 3. ABFRAGEN: Erst im Cache schauen, sonst Internet,
//    Erfolg direkt mitcachen (Cache-first-Strategie)
// ------------------------------------------------------------
self.addEventListener('fetch', (event) => {
    // Nur normale Lese-Anfragen abfangen (POST usw. ignorieren)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then((cached) => {
                // 1. Fund im Cache? → sofort liefern (offline-tauglich)
                if (cached) return cached;

                // 2. Nicht im Cache → aus dem Internet holen
                return fetch(event.request).then((response) => {
                    // Nur erfolgreiche Antworten der eigenen Domain cachen
                    if (response.ok && new URL(event.request.url).origin === location.origin) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                }).catch(() => {
                    // 3. Ganz ohne Netz: Fallback auf die Terminal-Seite
                    return caches.match('./index.html');
                });
            })
    );
});
