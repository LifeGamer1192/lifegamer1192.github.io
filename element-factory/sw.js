// 流用元: ima-rpg/public/sw.js
// P12: play offline. The page is fetched fresh when online (and kept for
// offline); built files, art and sample worlds are kept once fetched.
const CACHE = 'element-factory-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (e.request.mode === 'navigate') {
      try {
        const res = await fetch(e.request);
        cache.put(e.request, res.clone());
        return res;
      } catch {
        return (await cache.match(e.request)) || (await cache.match('./')) || Response.error();
      }
    }
    const hit = await cache.match(e.request);
    if (hit) return hit;
    const res = await fetch(e.request);
    if (res.ok) cache.put(e.request, res.clone());
    return res;
  })());
});
