// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session";
import { User } from "../pages/api/auth/signIn";

export const sessionOptions: IronSessionOptions = {
  cookieName: process.env.AUTH_COOKIE!,
  password: process.env.AUTH_SECRET!,
  cookieOptions: { secure: false, },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
