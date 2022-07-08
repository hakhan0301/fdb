import { v4 as uuidv4 } from 'uuid';
import type { NextApiRequest, NextApiResponse } from 'next';

import S3 from 'aws-sdk/clients/s3';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../lib/session';

const s3 = new S3({
  region: process.env.IMAGE_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
});

async function generateS3Url(): Promise<string> {
  return s3.getSignedUrl('putObject', {
    Bucket: process.env.IMAGE_BUCKET,
    Key: uuidv4(),
  });
}

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return GET_generateImageUrl(req, res);
      default:
        return res.status(404).json('Route not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function GET_generateImageUrl(req: NextApiRequest, res: NextApiResponse) {
  const s3Url = await generateS3Url();
  return res.status(200).send(s3Url);
}
