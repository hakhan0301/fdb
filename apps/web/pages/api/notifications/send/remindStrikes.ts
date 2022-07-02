import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@fdb/db';
import { sendNotification } from '@fdb/notifications/backend';
import { getYesterday, timeWhenStrike } from '@fdb/db/lib/streakStrikeHelpers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (req.query.apiKey !== process.env.NOTIFICATION_SECRET)
    return res.status(400).json('Incorrect apiKey.');

  try {
    switch (method) {
      case 'GET':
        return GET_almostStriked(req, res);
      default:
        return res.status(404).json('METHOD not found.');
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({ error: 'Internal Server Error.' });
  }
}

async function GET_almostStriked(req: NextApiRequest, res: NextApiResponse) {
  const todayMorning = new Date();
  todayMorning.setHours(0, 0, 0, 0);

  const users = await prisma.user.findMany({
    where: {
      lastPost: { lt: todayMorning },
      lastStrike: { lt: todayMorning },
      subscription: { isNot: null }
    },
    select: {
      subscription: true,
      lastPost: true,
      lastStrike: true
    }
  });

  const promises = users.map(user => {
    const millisTillStrike = timeWhenStrike(user.lastPost, user.lastStrike).getTime() - new Date().getTime();
    const minutesTillStrike = Math.round(millisTillStrike / 60000);
    const hoursTillStrike = Math.round(((minutesTillStrike / 60) + Number.EPSILON) * 10) / 10;

    const timeMessage = hoursTillStrike > 1
      ? `${hoursTillStrike} hours`
      : `${minutesTillStrike} minutes`;

    let message = (minutesTillStrike < 0
      ? 'Your account will be striked for missing a daily post. \nHow could you?'
      : `You are about to be striked in ${timeMessage}, you must post every day.`
    );

    return sendNotification(user.subscription!, message);
  });

  await Promise.all(promises);

  return res.status(200).json('Success.');
}
