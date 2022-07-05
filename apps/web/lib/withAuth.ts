import { withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next/types";
import { User } from "../pages/api/auth/signIn";
import { sessionOptions } from "./session";

const defaultServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    return {
      props: { user: user || null },
    };
  },
  sessionOptions
);

export default defaultServerSideProps;

export const withSessionSsr = (handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<any> | Promise<GetServerSidePropsResult<any>>) =>
  withIronSessionSsr(handler, sessionOptions)
