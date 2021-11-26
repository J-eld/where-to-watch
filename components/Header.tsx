import React from "react";
import Image from "next/image";
import styles from "../styles/header/header.module.css";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <div>
      <Link href="/">
        <div className={styles.headerLogo}>
          <Image width={470 / 1.5} height={86 / 1.5} src="/logo.png" />
        </div>
      </Link>
    </div>
  );
};
