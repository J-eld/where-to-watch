import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/homepage/Home.module.css";
import Container from "@material-ui/core/Container";
import { Header } from "../components/Header";
import { HomepageBody } from "../components/homepage/HomepageBody";

const Home: NextPage = () => {
  return (
    <div className={styles.homepageRoot}>
      <Container maxWidth="xl">
        <Header />
        <HomepageBody />
      </Container>
    </div>
  );
};

export default Home;
