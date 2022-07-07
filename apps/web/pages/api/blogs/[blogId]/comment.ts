import { addComment } from '@fdb/db/models/blogs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../../lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      if (!req.session.user) return res.status(401).json('Not Authorized');

      return POST_blog_comment(req, res);
    default:
      return res.status(404).json('Route not found.');
  }
}

async function POST_blog_comment(req: NextApiRequest, res: NextApiResponse) {
  const comment = req.body;
  const blogId = parseInt(req.query.blogId as string, 10);
  const id = req.session.user!.id;

  try {
    await addComment(comment, blogId, id);
    return res.status(200).json({ error: false });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}
