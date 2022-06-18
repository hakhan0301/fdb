import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@fdb/db';
import { sendNotification } from '@fdb/notifications/backend';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  try {
    switch (method) {
      case 'GET':
        return GET_testNotifications(req, res);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function GET_testNotifications(req: NextApiRequest, res: NextApiResponse) {
  const subscriptions = await prisma.subscription.findMany();

  await Promise.all(
    subscriptions.map(
      subscription => sendNotification(subscription, 'SUSSY BAKA')
    )
  );

  return res.status(200).send('Success.');
}
