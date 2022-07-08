
import { withIronSessionApiRoute } from "iron-session/next";
import { compare } from "bcrypt";

import { prisma } from '@fdb/db';
import { tryStrikeUser } from "@fdb/db/models/users";
import { sessionOptions } from "../../../lib/session";

async function getUser(username: string, password: string) {
  let user = await prisma.user.findFirst({
    where: { name: username }
  });

  if (!user) return null;

  const passwordsMatch = await compare(password as string, user?.password);
  if (!passwordsMatch) return null;

  const striked = await tryStrikeUser(user.name, user.lastPost, user.lastStrike);
  if (striked)
    user.strikes++;

  return user;
}

export type User = {
  id: string;
  name: string;
  image: string;
  streaks: number;
  strikes: number;
  lastPost: Date;
  lastStrike: Date;
}

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const { username, password } = JSON.parse(req.body);

    if (!username || !password) {
      throw new Error('invalid username or password');
    }

    const user = await getUser(username, password);
    if (!user) return res.status(400).send("Unauthorized.");

    req.session.user = {
      id: user.id,
      name: user.name,
      image: user.image,
      streaks: user.streaks,
      strikes: user.strikes,
      lastPost: user.lastPost,
      lastStrike: user.lastStrike
    }
    await req.session.save();

    res.send({ ok: true });
  },
  sessionOptions
);
