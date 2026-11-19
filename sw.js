// Offline-Speicher. Version ändert sich bei jedem Update automatisch.
const CACHE = 'svd-3504c0a7';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE && x !== OCR_CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
// Erst Netz (für Updates), bei fehlendem Netz der Speicher
// Texterkennung (ocr5/): feste Version, einmal laden und dauerhaft offline halten
const OCR_CACHE = 'svd-ocr5';
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  if(new URL(e.request.url).pathname.includes('/ocr5/')){
    e.respondWith(caches.open(OCR_CACHE).then(c => c.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request).then(n => { if(n.ok) c.put(e.request, n.clone()); return n; }))));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match('./index.html'))));
});
