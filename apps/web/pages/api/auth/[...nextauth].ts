import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { compare } from "bcrypt";
import { prisma } from "@fdb/db";
import { tryStrikeUser } from "@fdb/db/models/users";

async function getUser(username: string, password: string) {
  let user = await prisma.user.findFirst({
    where: { name: username }
  });

  if (!user) return null;

  const passwordsMatch = await compare(password as string, user?.password);
  if (!passwordsMatch) return null;

  const striked = await tryStrikeUser({ ...user, username });
  if (striked)
    user.strikes++;

  return user;
}

export default NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await getUser(
          credentials?.username as string,
          credentials?.password as string
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          image: user.image,
          streak: user.streaks,
          strikes: user.strikes,
          lastPost: user.lastPost
        };
      },
    }),
  ],
  callbacks: {
    signIn: ({ user }: { user: any }) => {
      if (user.strikes >= 3)
        return 'banned';

      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) { token.user = user };
      return token;
    },
    session: ({ session, token }) => {
      session.user = { ...session.user, ...token.user as any };
      return session;
    }
  },
  session: {
    strategy: "jwt",

  },
  pages: {
    signIn: '/login',
    error: '/'
  }
});