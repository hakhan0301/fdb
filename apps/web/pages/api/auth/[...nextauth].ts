import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { compare } from "bcrypt";

import { prisma } from "@fdb/db";

export default NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findFirst({
          where: { name: credentials?.username }
        });

        if (!user) return null;

        const passwordsMatch = await compare(credentials?.password as string, user?.password);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          name: user.name,
          image: user.image
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.user = user;
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