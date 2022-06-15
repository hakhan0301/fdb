import { useSession } from "next-auth/react";

export default function Component() {
  const session = useSession();


  return (
    <div className="flex h-[100%] flex-col gap-12 p-12 bg-slate-700 text-white">
      <pre className="bg-purple-900 p-6 overflow-auto">
        session: {JSON.stringify(session, null, 2)}
      </pre>
      <pre className="bg-purple-900 p-6 overflow-auto">
        window.location.hostname: {session.data && window?.location?.hostname}
      </pre>
    </div>
  );
}

