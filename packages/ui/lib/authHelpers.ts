import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function useRedirect({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  redirect = '/login', session = useSession()
} = {}) {
  const router = useRouter();
  const user = session.data?.user;
  const isLoading = session.status === 'loading';


  if (!user && !isLoading && router.route !== redirect) {
    const allowedRoutes = ['/login', '/test', '/banned', redirect];
    if (!allowedRoutes.includes(router.route)) {
      router.push(redirect);
    }
  }
}