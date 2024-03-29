import type { NextPage } from "next";
import Head from "next/head";
import { Header } from "../components/Header";
import { HomepageBody } from "../components/homepage/HomepageBody";

const Home: NextPage = () => {
  return (
    <>
      <main className="mx-auto flex flex-col min-h-screen p-4 max-w-screen-xl">
        <Header />
        <HomepageBody />
      </main>
    </>
  );
};

export default Home;
