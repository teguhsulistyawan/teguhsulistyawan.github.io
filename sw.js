/* Service Worker TS NETWORK: cache hanya dokumen navigasi, bukan API/data pembayaran. */
const CACHE_NAME = 'ts-network-shell-v1';
const START_URL = '/';

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        // Simpan halaman utama untuk fallback saat offline. Kegagalan cache tidak menggagalkan instalasi SW.
        try {
            const cache = await caches.open(CACHE_NAME);
            const response = await fetch(START_URL, { cache: 'reload' });
            if (response.ok) {
                await cache.put(START_URL, response.clone());
            }
        } catch (error) {
            console.warn('Halaman utama belum dapat disimpan untuk mode offline:', error);
        }
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames
            .filter((name) => name.startsWith('ts-network-shell-') && name !== CACHE_NAME)
            .map((name) => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET' || request.mode !== 'navigate') return;

    const url = new URL(request.url);
    // Jangan cache URL berparameter (misalnya invoice.html?data=...) atau halaman dari domain lain.
    if (url.origin !== self.location.origin || url.search) return;

    event.respondWith((async () => {
        try {
            const response = await fetch(request);
            if (response && response.ok) {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(request, response.clone());
            }
            return response;
        } catch (error) {
            const cache = await caches.open(CACHE_NAME);
            const cachedPage = await cache.match(request) || await cache.match(START_URL);
            if (cachedPage) return cachedPage;
            return new Response('TS NETWORK tidak dapat diakses saat offline. Periksa koneksi internet Anda.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }
    })());
});
