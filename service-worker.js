// Nama cache
const CACHE_NAME = "carwash-cache-v1";

// Semua file yang akan disimpan offline
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/assets/icons/icon-192.png",
  "/assets/sounds/icon-512.png.jpeg",  // ✅ homescreen icon ikut dicache
  "/assets/sound/success.mp3",
  "/assets/sound/error.mp3",
  "/assets/sound/klik.mp3",
  "/assets/sound/welcome.mp3"
];

// Install Service Worker
self.addEventListener("install", event => {
  console.log("Service Worker: Installing…");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate Service Worker
self.addEventListener("activate", event => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Fetch (serve from cache first, fallback to network)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
