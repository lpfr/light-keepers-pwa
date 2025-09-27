const CACHE_NAME = 'light-keepers-v3-' + Date.now();
const ASSETS = [
  '/light-keepers-pwa/',
  '/light-keepers-pwa/index.html',
  '/light-keepers-pwa/manifest.json',
  '/light-keepers-pwa/icon-192.png',
  '/light-keepers-pwa/icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
    .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r =>
      r || fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match('/light-keepers-pwa/index.html'))
    )
  );
});

