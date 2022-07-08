import NavBar from '@fdb/ui/webapp/NavBar';
import '../styles/globals.css';
import Head from 'next/head';
import { SSRProvider } from '@react-aria/ssr';

import type { AppProps } from 'next/app';

const headContent = [
  <meta name='application-name' content='FDB' key={Math.random()} />,
  <meta name='description' content='FOOLAR DB' key={Math.random()} />,
  <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' key={Math.random()} />,
  <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' key={Math.random()} />,
  <link rel='manifest' href='/manifest.json' key={Math.random()} />,

];

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  const Header = () => (
    <Head>
      <title>Foolar DB - FDB</title>
      <meta name="description" content="FOOLARS ASSEMBLE" />
      <link rel="icon" href="/favicon.ico" />
      {headContent}
    </Head>
  );


  return (
    <>
      <Header />
      <main className="h-screen flex flex-col">
        <SSRProvider>
          <NavBar />
          <div className='flex-grow'>
            <Component {...pageProps} />
          </div>
        </SSRProvider>
      </main>
    </>
  );
}

export default MyApp;
