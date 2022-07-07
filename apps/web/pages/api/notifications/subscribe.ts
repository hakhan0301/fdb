import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@fdb/db';
import type { PushSubscription } from 'web-push';
import { sessionOptions } from '../../../lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user)
    return res.status(401).json('Not Authorized');

  try {
    switch (req.method) {
      case 'POST':
        return POST_subscribe(req, res);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function POST_subscribe(req: NextApiRequest, res: NextApiResponse) {
  const { subscription }: { subscription: PushSubscription } = JSON.parse(req.body);
  const { id } = req.session.user!;

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
