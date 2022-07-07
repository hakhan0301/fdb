import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@fdb/db';
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from '../../../lib/session';

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const user = req.session.user;
  if (!user)
    return res.status(401).json('Not Authorized');

  try {
    switch (method) {
      case 'GET':
        return GET_streakStrike(req, res);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function GET_streakStrike(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.session.user!;

  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      streaks: true,
      strikes: true
    }
  });

  if (!user) return res.status(404);
  return res.status(200).json(user);
}
