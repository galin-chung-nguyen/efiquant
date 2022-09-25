import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaEnvelope, FaRegEnvelope } from 'react-icons/fa';
import { MdLock, MdLockOutline } from 'react-icons/md';

const Home: NextPage = () => {
  window.location.href = '/stock/BTC';

  return (
    <>
      <Head>
        <title>Home page - Infina</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello World, this is NextJS
    </>
  )
}

export default Home
