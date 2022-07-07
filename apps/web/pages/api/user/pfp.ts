import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@fdb/db';
import { sessionOptions } from '../../../lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(handler, sessionOptions);


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        if (!req.session.user)
          return res.status(401).json('Not Authorized');

        return POST_generateImageUrl(req, res);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function POST_generateImageUrl(req: NextApiRequest, res: NextApiResponse) {
  const { url } = JSON.parse(req.body);
  const { id } = req.session.user!;

  await prisma.user.update({
    where: { id },
    data: { image: url }
  });

  return res.status(200).send('Success.');
}
