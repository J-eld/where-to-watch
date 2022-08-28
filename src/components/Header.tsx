import React from "react";
import Image from "next/image";
import Link from "./Link";

export const Header: React.FC = () => {
  return (
    <div className="flex justify-center md:justify-start">
      <Link href="/">
        <div className="cursor-pointer motion-safe:hover:scale-105 duration-300 w-fit ">
          <Image width={470 / 1.5} height={86 / 1.5} src="/logo.png" alt="logo" />
        </div>
      </Link>
    </div>
  );
};
