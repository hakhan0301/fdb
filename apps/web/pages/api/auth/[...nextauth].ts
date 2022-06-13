import NextAuth from "next-auth";

import { prisma } from "@fdb/db";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findFirst({
          where: {
            name: credentials?.username,
            password: credentials?.password,
          }
        });

        if (!user) return null;

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
      session.user = { ...session.user, ...token.user };
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