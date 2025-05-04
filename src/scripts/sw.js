import 'regenerator-runtime';
import CacheHelper from './utils/cache-helper';

const assetsToCache = [
  './',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  './index.html',
  './iconfind.png',
  './app.bundle.js',
  './app.webmanifest',
  './sw.bundle.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(CacheHelper.cachingAppShell([...assetsToCache]));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(CacheHelper.deleteOldCache());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(CacheHelper.revalidateCache(event.request));
});

// Tambahan: Event listener untuk Push Notification
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.text() : 'Push message tanpa payload';

  const options = {
    body: data,
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-192x192.png',
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification('Kuliner Nusantara', options)
  );
});
