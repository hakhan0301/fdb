import type { ServiceWorkerGlobalScope } from './types';
declare let self: ServiceWorkerGlobalScope;

// @ts-ignore
self.__WB_DISABLE_DEV_LOGS = true;


console.log('Hello from Service Worker!');

self.addEventListener('push', (event) => {
  const data = event?.data.text() || 'NOTIFICATION';
  event?.waitUntil(
    self.registration.showNotification('FDB - Foolar DB', {
      body: data, icon: '/icons/android-chrome-192x192.png'
    })
  )
});
