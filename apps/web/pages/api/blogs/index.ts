import { addBlog, getBlogs } from '@fdb/db/models/blogs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { tryIncrementStreaks, tryStrikeUser } from '@fdb/db/models/users';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../lib/session';

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    if (!req.session.user) return res.status(401).json('Not Authorized');
    switch (method) {
      case 'POST':
        return POST_blog(req, res);
      case 'GET':
        return GET_blog(req, res);
      default:
        return res.status(404).json('Route not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function POST_blog(req: NextApiRequest, res: NextApiResponse) {
  const { body }: { body: any } = req;
  const user = req.session.user!;

  user.lastPost = new Date(user.lastPost);
  user.lastStrike = new Date(user.lastStrike);

  await tryStrikeUser(user.name, user.lastPost, user.lastStrike);

  const [newPost] = await Promise.all([
    await addBlog(JSON.parse(body), user.id!),
    await tryIncrementStreaks({ ...user }),
  ]);

  return res.status(200).json(newPost);
}



async function GET_blog(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user!;

  if (user.strikes >= 3) {
    return res.status(400).send('Banned');
  }

  const cursor = req.query.cursor as string;
  const posts = await getBlogs(user.id, cursor);

  return res.status(200).json(posts);
}
