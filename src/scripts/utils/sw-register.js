import * as WorkboxWindow from 'workbox-window';

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }

  const wb = new WorkboxWindow.Workbox('./sw.bundle.js');

  try {
    await wb.register();
    console.log('Service worker registered');

    // Tunggu sampai SW siap
    const registration = await navigator.serviceWorker.ready;

    // Minta izin notifikasi
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission not granted for Notification');
      return;
    }

    // Subscribe ke PushManager
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('<YOUR_PUBLIC_VAPID_KEY_HERE>')
    };

    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
    console.log('Push Subscription:', JSON.stringify(pushSubscription));
    
    // TODO: Kirim pushSubscription ke server kamu jika diperlukan

  } catch (error) {
    console.error('Service worker registration or push subscription failed:', error);
  }
};

// Helper untuk konversi VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

export default swRegister;
