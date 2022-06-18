import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@fdb/db';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { PushSubscription } from 'web-push';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        const session = await getSession({ req })
        if (!session)
          return res.status(401).json('Not Authorized');

        return POST_subscribe(req, res, session);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function POST_subscribe(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { subscription }: { subscription: PushSubscription } = JSON.parse(req.body);
  const { id } = session.user as any;

  await prisma.subscription.upsert({
    where: { userId: id },
    update: {
      endpoint: subscription.endpoint,
      key_p256dh: subscription.keys.p256dh,
      key_auth: subscription.keys.auth,
    },
    create: {
      userId: id,
      endpoint: subscription.endpoint,
      key_p256dh: subscription.keys.p256dh,
      key_auth: subscription.keys.auth,
    }
  });

  return res.status(200).send('Success.');
}
