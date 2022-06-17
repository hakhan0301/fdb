import { prisma } from "..";

function isBeforeYesterdayMorning(time: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return time.getTime() < yesterday.getTime();
}

function isBeforeToday(time: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return time.getTime() < yesterday.getTime();
}

function isYesterday(time: Date) {
  return time.getDate() === new Date().getDate() - 1;
}

function deservesStrike(lastPost: Date, lastStrike: Date): boolean {
  if (!lastPost) return false;
  return isBeforeYesterdayMorning(lastPost) && isBeforeToday(lastStrike);
}

interface User {
  username: string;
  strikes: number;
  lastPost: Date;
  lastStrike: Date;
}

export async function tryStrikeUser({ username, strikes, lastPost, lastStrike }: User) {
  if (deservesStrike(lastPost, lastStrike)) {
    await prisma.user.update({
      where: { name: username },
      data: {
        lastStrike: new Date(),
        strikes: { increment: 1 },
      }
    });
    return true;
  }

  return false;
}


export async function tryStrikeFetchedUser(username: string) {
  let user = await prisma.user.findFirst({
    where: { name: username }
  });

  if (!user) return null;

  const striked = await tryStrikeUser({ ...user, username });
  if (striked) {
    user.strikes++;
  }

  return user;
}

export function streakLogic(lastPost: Date) {
  if (isYesterday(lastPost)) {
    return 'increment';
  } else if (isBeforeYesterdayMorning(lastPost)) {
    return 'reset';
  }

  return 'none';
}

export async function updateStreaks(
  { id, lastPost }: { id: string, lastPost: Date },
  { userPosted = false }: { userPosted?: boolean } = {}
) {
  switch (streakLogic(lastPost)) {
    case 'increment': {
      const { streaks } = await prisma.user.update({
        where: { id },
        data: {
          lastPost: new Date(),
          streaks: { increment: userPosted ? 1 : 0 }
        },
        select: { streaks: true }
      });

      return streaks;
    }
    case 'reset': {
      const { streaks } = await prisma.user.update({
        where: { id },
        data: {
          lastPost: new Date(), streaks: {
            set: userPosted ? 1 : 0
          }
        },
        select: { streaks: true }
      });
    }
  }

  return 0;
}