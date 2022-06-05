import NavBar from '@fdb/ui/NavBar';
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (<>
    <Head>
      <title>Foolar Daily Blog - FDB</title>
      <meta name="description" content="FOOLARS ASSEMBLE" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <NavBar />
    <Component {...pageProps} />
  </>);
}

export default MyApp;
