import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function useUser({
  redirect = '/login'
} = {}) {
  const session = useSession();
  const router = useRouter();
  const user = session.data?.user;
  const isLoading = session.status === 'loading';



  if (!user && !isLoading && router.route !== redirect) {
    router.push(redirect);
  }

  return isLoading ? { loading: true } : user;
}