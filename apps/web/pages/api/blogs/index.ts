import { addBlog } from '@fdb/db/models/blogs';
import { getSession } from "next-auth/react";

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'POST':
      const session = await getSession({ req })
      if (!session)
        return res.status(401).json('Not Authorized');

      return POST_blog(req, res, session);
    default:
      return res.status(404).json('Route not found.');
  }
}

async function POST_blog(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { body }: { body: any } = req;

  console.log(JSON.parse(body).body);


  try {
    await addBlog(JSON.parse(body), session.user?.email as string);
    return res.status(200).json({ error: false });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}
