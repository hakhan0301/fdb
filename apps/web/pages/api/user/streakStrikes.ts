import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@fdb/db';
import { getSession } from 'next-auth/react';
import type { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const session = await getSession({ req })
        if (!session)
          return res.status(401).json('Not Authorized');

        return GET_streakStrike(req, res, session);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function GET_streakStrike(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { id } = session.user as any;

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
