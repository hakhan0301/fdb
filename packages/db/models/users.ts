import { User } from "@prisma/client";
import { prisma } from "..";
import { deservesStrike, isYesterday } from "../lib/streakStrikeHelpers";


export async function tryStrikeUser({ name, lastPost, lastStrike }: User) {
  if (!deservesStrike(lastPost, lastStrike)) {
    return false;
  }

  await prisma.user.update({
    where: { name },
    data: {
      lastStrike: new Date(),
      strikes: { increment: 1 },
      streaks: { set: 0 }
    }
  });
  return true;
}

export async function tryStrikeFetchedUser(name: string) {
  let user = await prisma.user.findFirst({
    where: { name }
  });

  if (!user) return null;

  const striked = await tryStrikeUser({ ...user, name });
  if (striked) {
    user.strikes++;
  }

  return user;
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
      streaks: { increment: 1 }
    },
    select: { streaks: true }
  });

  return streaks;
}