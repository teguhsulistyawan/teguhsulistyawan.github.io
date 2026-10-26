const CACHE_NAME = 'shamela-ai-shell-v2';
const SHELL_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/shamela-192.svg',
  './icons/shamela-512.svg',
  './icons/shamela-192.png',
  './icons/shamela-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('shamela-ai-shell-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never cache Shamela's third-party pages or authenticated content.
  if (url.origin !== self.location.origin) return;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok && url.pathname.startsWith('/shamela-ai/')) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (url.pathname === '/shamela-ai/' || url.pathname === '/shamela-ai/index.html') {
          const shell = await caches.match('./index.html');
          if (shell) return shell;
        }
        return new Response('Tidak ada koneksi internet. Shamela AI memerlukan internet untuk memuat layanan aslinya.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
