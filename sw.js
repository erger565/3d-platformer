var filesToCache = [
  '/',
  '/client/index.html',
  '/client/style.css',
  '/client/main.js',
  '/client/controls.js',
  '/client/oof.mp3',
  '/client/things.js',
  'index.js',
  'classes.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});