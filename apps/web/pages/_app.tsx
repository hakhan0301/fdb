import NavBar from '@fdb/ui/NavBar';
import '../styles/globals.css';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Foolar Daily Blog - FDB</title>
        <meta name="description" content="FOOLARS ASSEMBLE" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen w-screen flex flex-col">
        <NavBar />
        <div className='flex-grow'>
          <Component {...pageProps} />
        </div>
      </main>
    </SessionProvider>
  );
}

export default MyApp;
