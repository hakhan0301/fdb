import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  try {
    switch (method) {
      case 'GET':
        return GET_vapidPublic(req, res);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function GET_vapidPublic(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).send(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
}
