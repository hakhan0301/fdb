import type { NextApiRequest, NextApiResponse } from 'next';
import { addBlog } from '../../../lib/models/blogs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return postBlog(req, res);
    default:
      return res.status(404).json('Route not found.');
  }
}

async function postBlog(req: NextApiRequest, res: NextApiResponse) {
  const { body }: { body: string } = req;

  try {
    await addBlog({ text: body });
    return res.status(200).json({ error: false });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}
