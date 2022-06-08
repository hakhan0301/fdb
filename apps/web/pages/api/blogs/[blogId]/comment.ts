import { addComment, dislikeBlog } from '@fdb/db/models/blogs';
import { getSession } from "next-auth/react";

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const session = await getSession({ req });
      if (!session) return res.status(401).json('Not Authorized');

      return POST_blog_comment(req, res, session);
    default:
      return res.status(404).json('Route not found.');
  }
}

async function POST_blog_comment(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const comment = req.body;
  const blogId = parseInt(req.query.blogId as string, 10);
  const email = session.user?.email as string;

  console.log(comment, blogId, email);


  try {
    await addComment(comment, blogId, email);
    return res.status(200).json({ error: false });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}