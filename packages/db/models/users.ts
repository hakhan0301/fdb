import { User } from "@prisma/client";
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

export async function tryStrikeUser({ name, lastPost, lastStrike }: User) {
  if (deservesStrike(lastPost, lastStrike)) {
    await prisma.user.update({
      where: { name },
      data: {
        lastStrike: new Date(),
        strikes: { increment: 1 },
      }
    });
    return true;
  }

  return false;
}


export async function tryStrikeFetchedUser(name: string) {
  let user = await prisma.user.findFirst({
    where: { name: name }
  });

  if (!user) return null;

  const striked = await tryStrikeUser({ ...user, name });
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

export async function tryResetStreaks(
  { name, lastPost }: { name: string, lastPost: Date }
) {
  if (!isBeforeYesterdayMorning(lastPost)) {
    return false;
  }

  await prisma.user.update({
    where: { name },
    data: {
      lastPost: new Date(),
      streaks: { set: 0 }
    }
  });

  return true;
}


export async function tryIncrementStreaks(
  { id, lastPost }: { id: string, lastPost: Date }
) {
  if (!isYesterday(lastPost)) {
    return false;
  }

  const { streaks } = await prisma.user.update({
    where: { id },
    data: {
      lastPost: new Date(),
      streaks: { increment: 1 }
    },
    select: { streaks: true }
  });

  return streaks;
}