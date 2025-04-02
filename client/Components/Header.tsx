"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn } from "lucide-react";

function Header() {
  const { isAuthentcated } = useGlobalContext();
  const pathName = usePathname();

  return (
    <header className="flex justify-between items-center py-6 px-10 bg-[#d7dedc] shadow-md text-gray-700">
      <Link href={"/"} className="flex items-center gap-4">
        {/* <Image src="/vercel.svg" alt="logo" width={45} height={45} /> */}
        <h1 className="font-extrabold text-2xl text-[#2f42c2]">
          Job Board Project
        </h1>
      </Link>

      <ul className="flex items-center gap-8 mr-10">
        <li>
          <Link
            href={"/myjobs"}
            className={`py-2 px-6  ${
              pathName === "myjobs"
                ? "text-[#2f42c2] border-[#2f42c2] border bg-[#2f42c2]/10"
                : ""
            }`}
          >
            My Jobs
          </Link>
          <Link
            href={"/findwork"}
            className={`py-2 px-6  ${
              pathName === "findwork"
                ? "text-[#2f42c2] border-[#2f42c2] border bg-[#2f42c2]/10"
                : ""
            }`}
          >
            Find Work
          </Link>
          <Link
            href={"/post"}
            className={`py-2 px-6  ${
              pathName === "post"
                ? "text-[#2f42c2] border-[#2f42c2] border bg-[#2f42c2]/10"
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
              className="text-[#2f42c2] font-semibold border border-[#2f42c2] rounded-md py-2 px-6 flex items-center gap-2 hover:bg-[#2f42c2]/10 transition-all duration-200 ease-in-out"
            >
              <LogIn className="w-4 h-4">Login</LogIn>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
