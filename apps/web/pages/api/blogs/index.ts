import { addBlog, getBlogs } from '@fdb/db/models/blogs';
import { getSession } from "next-auth/react";

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';
import { User } from '@fdb/db/types';
import { tryIncrementStreaks, tryStrikeUser } from '@fdb/db/models/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    const session = await getSession({ req })
    if (!session) return res.status(401).json('Not Authorized');
    switch (method) {
      case 'POST':
        return POST_blog(req, res, session);
      case 'GET':
        return GET_blog(req, res, session);
      default:
        return res.status(404).json('Route not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function POST_blog(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { body }: { body: any } = req;
  const user = session.user as User;

  user.lastPost = new Date(user.lastPost);
  user.lastStrike = new Date(user.lastStrike);

  await tryStrikeUser({ ...user });

  const [newPost] = await Promise.all([
    await addBlog(JSON.parse(body), user.id!),
    await tryIncrementStreaks({ ...user }),
  ]);

  return res.status(200).json(newPost);
}



async function GET_blog(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const user = session.user as User;


  if (user.strikes >= 3) {
    return res.status(400).send('Banned');
  }

  const cursor = req.query.cursor as string;
  const posts = await getBlogs(user.id, cursor);

  return res.status(200).json(posts);
}
