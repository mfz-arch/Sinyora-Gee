import webpush from 'web-push';
import { DatabaseSchema, PushSubscriptionRecord } from './types';

let vapidConfigured = false;
let generatedFallbackKeys: { publicKey: string; privateKey: string } | null =
  null;

function getVapidKeys(): { publicKey: string; privateKey: string } {
  const envPublic = process.env.VAPID_PUBLIC_KEY;
  const envPrivate = process.env.VAPID_PRIVATE_KEY;

  if (envPublic && envPrivate) {
    return { publicKey: envPublic, privateKey: envPrivate };
  }

  if (!generatedFallbackKeys) {
    generatedFallbackKeys = webpush.generateVAPIDKeys();
  }
  return generatedFallbackKeys;
}

export function getPublicVapidKey(): string {
  const keys = getVapidKeys();
  if (!vapidConfigured) {
    webpush.setVapidDetails(
      'mailto:sinyoragee@royalhostel.com',
      keys.publicKey,
      keys.privateKey
    );
    vapidConfigured = true;
  }
  return keys.publicKey;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

async function sendToSubscriptions(
  subscriptions: PushSubscriptionRecord[],
  payload: PushPayload,
  state: DatabaseSchema,
  saveStateFn: (s: DatabaseSchema) => Promise<void>
): Promise<void> {
  if (subscriptions.length === 0) return;

  getPublicVapidKey();

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || '/app',
    tag: payload.tag || 'sinyora-gee-alert',
  });

  const expiredEndpoints = new Set<string>();

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          notificationPayload
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          expiredEndpoints.add(sub.endpoint);
        }
      }
    })
  );

  if (expiredEndpoints.size > 0 && state.pushSubscriptions) {
    state.pushSubscriptions = state.pushSubscriptions.filter(
      (s) => !expiredEndpoints.has(s.endpoint)
    );
    await saveStateFn(state);
  }
}

export async function notifyAdmins(
  state: DatabaseSchema,
  saveStateFn: (s: DatabaseSchema) => Promise<void>,
  payload: PushPayload
): Promise<void> {
  const subs = (state.pushSubscriptions || []).filter(
    (s) => s.role === 'admin'
  );
  await sendToSubscriptions(subs, payload, state, saveStateFn);
}

export async function notifyAllClients(
  state: DatabaseSchema,
  saveStateFn: (s: DatabaseSchema) => Promise<void>,
  payload: PushPayload
): Promise<void> {
  const subs = (state.pushSubscriptions || []).filter(
    (s) => s.role === 'client'
  );
  await sendToSubscriptions(subs, payload, state, saveStateFn);
}

export async function notifySpecificClient(
  state: DatabaseSchema,
  saveStateFn: (s: DatabaseSchema) => Promise<void>,
  clientPhone: string,
  clientId: string | undefined,
  payload: PushPayload
): Promise<void> {
  const normalizedPhone = clientPhone.replace(/\s+/g, '');
  const subs = (state.pushSubscriptions || []).filter(
    (s) =>
      (clientId && s.userId === clientId) ||
      (s.phone && s.phone.replace(/\s+/g, '') === normalizedPhone)
  );
  await sendToSubscriptions(subs, payload, state, saveStateFn);
}

