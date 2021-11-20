import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Where To Watch</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
