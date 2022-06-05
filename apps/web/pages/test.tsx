import { useSession } from "next-auth/react";

export default function Component() {
  const session = useSession()

  return (
    <div className="flex flex-grow flex-col gap-12 p-12 bg-slate-700 text-white">
      <pre className="bg-purple-900 p-6">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}

