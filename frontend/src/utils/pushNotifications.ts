import { UserAccount } from '@/types';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'https://sinyora-gee.onrender.com'
).replace(/\/+$/, '');

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function subscribeUserToPush(
  user: UserAccount
): Promise<{ ok: boolean; permission: NotificationPermission }> {
  if (!isPushSupported()) {
    return { ok: false, permission: 'denied' };
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    return { ok: false, permission };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const keyRes = await fetch(`${API_BASE_URL}/api/push/public-key`);
    if (!keyRes.ok) return { ok: false, permission };
    const { publicKey } = (await keyRes.json()) as { publicKey: string };
    if (!publicKey) return { ok: false, permission };

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
      });
    }

    await fetch(`${API_BASE_URL}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userId: user.id,
        phone: user.phone,
        role: user.role,
      }),
    });

    return { ok: true, permission };
  } catch {
    return { ok: false, permission };
  }
}

