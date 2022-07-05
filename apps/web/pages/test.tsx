import withAuth from "../lib/withAuth";
import { User } from "./api/auth/signIn";

export const getServerSideProps = withAuth;
export default function Component({ user }: { user: User }) {
  return (
    <div className="flex h-[100%] flex-col gap-12 p-12 bg-slate-700 text-white">
      <pre className="bg-purple-900 p-6 overflow-auto">
        user: {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}

