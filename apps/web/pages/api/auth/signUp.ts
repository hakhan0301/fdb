import { genSalt, hash } from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@fdb/db';

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

  const { username, password }: { username: string, password: string } = JSON.parse(body);

  if (!username || !password) {
    throw new Error('invalid username or password');
  }

  const passwordHash = await hash(password, await genSalt(10));

  await prisma.user.create({
    data: {
      name: username,
      password: passwordHash
    }
  });

  console.log(`created user : ${username}`);


  return res.status(200).json({ error: false });
}
