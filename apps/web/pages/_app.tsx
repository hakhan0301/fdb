import NavBar from '@fdb/ui/webapp/NavBar';
import '../styles/globals.css';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react";
import { SSRProvider } from '@react-aria/ssr';

import type { AppProps } from 'next/app';

const headContent = [
  <meta name='application-name' content='FDB' key={Math.random()} />,
  <meta name='apple-mobile-web-app-capable' content='yes' key={Math.random()} />,
  <meta name='apple-mobile-web-app-status-bar-style' content='default' key={Math.random()} />,
  <meta name='apple-mobile-web-app-title' content='FDB' key={Math.random()} />,
  <meta name='description' content='FOOLAR DB' key={Math.random()} />,
  <meta name='format-detection' content='telephone=no' key={Math.random()} />,
  <meta name='mobile-web-app-capable' content='yes' key={Math.random()} />,
  <meta name='msapplication-config' content='/icons/browserconfig.xml' key={Math.random()} />,
  <meta name='msapplication-TileColor' content='#2B5797' key={Math.random()} />,
  <meta name='msapplication-tap-highlight' content='no' key={Math.random()} />,
  <meta name='theme-color' content='#000000' key={Math.random()} />,
  <link rel='apple-touch-icon' href='/icons/touch-icon-iphone.png' key={Math.random()} />,
  <link rel='apple-touch-icon' sizes='152x152' href='/icons/touch-icon-ipad.png' key={Math.random()} />,
  <link rel='apple-touch-icon' sizes='180x180' href='/icons/touch-icon-iphone-retina.png' key={Math.random()} />,
  <link rel='apple-touch-icon' sizes='167x167' href='/icons/touch-icon-ipad-retina.png' key={Math.random()} />,
  <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' key={Math.random()} />,
  <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' key={Math.random()} />,
  <link rel='manifest' href='/manifest.json' key={Math.random()} />,
  <link rel='mask-icon' href='/icons/safari-pinned-tab.svg' color='#5bbad5' key={Math.random()} />,
  <link rel='shortcut icon' href='/favicon.ico' key={Math.random()} />,
  <meta name='twitter:card' content='summary' key={Math.random()} />,
  // <meta name='twitter:url' content='https://yourdomain.com' key={Math.random()}/>,
  <meta name='twitter:title' content='FDB' key={Math.random()} />,
  <meta name='twitter:description' content='FOOLAR DB' key={Math.random()} />,
  // <meta name='twitter:image' content='https://yourdomain.com/icons/android-chrome-192x192.png' key={Math.random()}/>,
  // <meta name='twitter:creator' content='@DavidWShadow' key={Math.random()}/>,
  <meta property='og:type' content='website' key={Math.random()} />,
  <meta property='og:title' content='FDB' key={Math.random()} />,
  <meta property='og:description' content='FOOLAR DB' key={Math.random()} />,
  <meta property='og:site_name' content='FDB' key={Math.random()} />,
  // <meta property='og:url' content='https://yourdomain.com' key={Math.random()}/>,
  // <meta property='og:image' content='https://yourdomain.com/icons/apple-touch-icon.png' key={Math.random()}/>,

]

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {

  const Header = () => (
    <Head>
      <title>Foolar Daily Blog - FDB</title>
      <meta name="description" content="FOOLARS ASSEMBLE" />
      <link rel="icon" href="/favicon.ico" />
      {headContent}
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
