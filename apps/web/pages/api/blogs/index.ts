import { addBlog } from '@fdb/db/models/blogs';
import { getSession } from "next-auth/react";

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { User } from '@fdb/db/types';
import { tryResetStreaks, tryStrikeUser } from '@fdb/db/models/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const session = await getSession({ req })
      if (!session)
        return res.status(401).json('Not Authorized');


      try {
        return POST_blog(req, res, session);
      } catch (e) {
        console.error(e);

        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    default:
      return res.status(404).json('Route not found.');
  }
}

async function POST_blog(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { body }: { body: any } = req;
  const user = session.user as User;


  await Promise.all([
    await tryStrikeUser({ ...user }),
    await tryResetStreaks({ ...user }),
    await addBlog(JSON.parse(body), user.id!),
  ])
  return res.status(200).json({ error: false });
}
