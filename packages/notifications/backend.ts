import type { Subscription } from '@fdb/db/types';
import type { PushSubscription } from 'web-push';

import webPush from 'web-push';

webPush.setVapidDetails(
  'https://serviceworke.rs/',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string,
);

export function sendNotification(rawSubscription: Subscription, message: string) {
  const subscription: PushSubscription = {
    endpoint: rawSubscription.endpoint,
    keys: {
      p256dh: rawSubscription.key_p256dh,
      auth: rawSubscription.key_auth,
    }
  };

  return webPush.sendNotification(subscription, message);
}