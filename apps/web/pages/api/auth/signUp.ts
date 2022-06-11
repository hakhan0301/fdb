import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@fdb/db';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;



  try {
    switch (method) {
      case 'POST':
        return POST_signUp(req, res);
      default:
        return res.status(404).json('Route not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function POST_signUp(req: NextApiRequest, res: NextApiResponse) {
  const { body }: { body: any } = req;

  const { username, password } = JSON.parse(body);
  console.log(username, password);

  if (!username || !password) {
    throw new Error('invalid username or password');
  }


  await prisma.userAuth.create({
    data: { username, password }
  });

  return res.status(200).json({ error: false });
}
