"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";

function Header() {
  const { isAuthentcated } = useGlobalContext();
  const pathName = usePathname();

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
      <Link href={"/"}>
        <Image src="/vercel.svg" alt="logo" width={45} height={45} />
        <h1 className="font-extrabold text-2xl text-[#7263f3]">
          Job Board Project
        </h1>
      </Link>

      <ul className="flex items-center gap-8">
        <li>
          <Link
            href={"/myjobs"}
            className={`py-2 px-6  ${
              pathName === "myjobs"
                ? "text-[#7263f3] border-[#7263f3] border bg-[#7263f3]/10"
                : ""
            }`}
          >
            My Jobs
          </Link>
          <Link
            href={"/findwork"}
            className={`py-2 px-6  ${
              pathName === "findwork"
                ? "text-[#7263f3] border-[#7263f3] border bg-[#7263f3]/10"
                : ""
            }`}
          >
            Find Work
          </Link>
          <Link
            href={"/post"}
            className={`py-2 px-6  ${
              pathName === "post"
                ? "text-[#7263f3] border-[#7263f3] border bg-[#7263f3]/10"
                : ""
            }`}
          >
            Post Job
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {isAuthentcated ? (
          <div>Profile</div>
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href={"http://localhost:8000/login"}
              className="text-[#7263f3] font-semibold"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
