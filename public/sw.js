// Minimale service worker voor basale offline-ondersteuning: pagina's en
// bestanden die je al eerder bezocht hebt blijven zichtbaar zonder internet.
// Gebruikt "netwerk eerst": bij internet krijg je altijd de nieuwste versie,
// zonder internet valt hij terug op wat al gecachet is. Zo zie je nooit
// onbedoeld een verouderde versie van de app terwijl je online bent.

const CACHE_NAME = 'wijnkast-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // Laat API/data-verkeer (Supabase, functies) altijd gewoon over het netwerk.
  if (url.pathname.startsWith('/.netlify/')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        return response
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
  )
})
