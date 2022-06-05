import NavBar from '@fdb/ui/NavBar';
import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Foolar Daily Blog - FDB</title>
        <meta name="description" content="FOOLARS ASSEMBLE" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
