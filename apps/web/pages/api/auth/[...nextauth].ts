import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@fdb/db";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string
    }),
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log('-----------------');

        console.log(credentials?.username, credentials?.password);


        const user = await prisma.userAuth.findFirst({
          where: {
            username: credentials?.username,
            password: credentials?.password,
          }
        });

        if (!user) return null;
        console.log(user);

        return {
          "name": "Sussy baka",
          "email": "test.com",
          "image": "https://lh3.googleusercontent.com/a-/AOh14Gj2pEcMh-szNOOK7zK_xSOhPDwj5GVRio4LIB0r=s96-c"
        };
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login',
    error: '/'
  }
});