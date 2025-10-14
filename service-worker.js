self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('carwash-cache-v1').then(cache => cache.addAll([
      '/',
      '/index.html',
      '/style.css',
      '/script.js',
      '/assets/icons/icon-192.png.PNG',
      '/assets/icons/icon-512.png.jpeg',
      '/assets/sounds/klik.mp3',
      '/assets/sounds/success.mp3',
      '/assets/sounds/error.mp3',
      '/assets/sounds/welcome.mp3'
    ]))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});

