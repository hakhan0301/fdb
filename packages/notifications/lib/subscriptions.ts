function convertityahooo(base64String: string) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getSubscription(registration: ServiceWorkerRegistration) {
  return registration.pushManager.getSubscription()
    .then(async function (subscription) {
      if (subscription) {
        return subscription;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;
      const convertedVapidKey = convertityahooo(vapidPublicKey);

      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    });
}

export async function subscribe() {
  await Notification.requestPermission();
  const registration = await navigator.serviceWorker.ready;
  const subscription = await getSubscription(registration);

  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription }),
  });
}
