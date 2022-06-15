import { prisma } from "..";

export function isBeforeYesterdayMorning(time: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return time.getTime() < yesterday.getTime();
}

export function isBeforeToday(time: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return time.getTime() < yesterday.getTime();
}

export function isYesterday(time: Date) {
  return time.getDate() === new Date().getDate() - 1;
}

export function deservesStrike(lastPost: Date, lastStrike: Date): boolean {
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
    return strikes + 1;
  }

  return strikes;
}


export async function tryStrikeFetchedUser(username: string) {
  const user = await prisma.user.findFirst({
    where: { name: username }
  });

  if (!user) return 0;

  await tryStrikeUser({ ...user, username });
  return user;
}
