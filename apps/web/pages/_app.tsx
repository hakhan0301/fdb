import NavBar from '@fdb/ui/webapp/NavBar';
import '../styles/globals.css';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react";
import { SSRProvider } from '@react-aria/ssr';

import type { AppProps } from 'next/app';

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  const Header = () => (
    <Head>
      <title>Foolar Daily Blog - FDB</title>
      <meta name="description" content="FOOLARS ASSEMBLE" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );


  return (
    <>
      <Header />
      <main className="h-screen flex flex-col">
        <SessionProvider session={session}>
          <SSRProvider>
            <NavBar />
            <div className='flex-grow'>
              <Component {...pageProps} />
            </div>
          </SSRProvider>
        </SessionProvider>
      </main>
    </>
  );
}

export default MyApp;
