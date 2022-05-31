import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;

  switch (method) {
    case 'POST':
      return res.status(200).json({ name: 'John Do2e' });
    default:
      return res.status(404).json('Route not found.');
  }


}
