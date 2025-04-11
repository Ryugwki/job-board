"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn, User } from "lucide-react";
import Profile from "./Profile";

function Header() {
  const { userProfile, isAuthenticated } = useGlobalContext();
  const { profession = "" } = userProfile || {};
  const isJobSeeker = profession?.toLowerCase() === "job seeker";
  const pathName = usePathname();

  // Create a helper function to generate nav link classes
  const getLinkClass = (path) => {
    const isActive = pathName === path;
    return `py-2 px-6 rounded-md text-xl font-semibold ${
      isActive ? "text-[#2f42c2] border-[#2f42c2] border bg-[#2f42c2]/10" : ""
    }`;
  };

  return (
    <header className="flex justify-between items-center py-6 px-10 bg-[#d7dedc] shadow-md text-gray-700">
      <Link href={"/"} className="flex items-center gap-4">
        <h1 className="font-extrabold text-2xl text-[#2f42c2]">
          Job Board Project
        </h1>
      </Link>

      <ul className="flex items-center gap-8 mr-10">
        {/* Always show Find Work for everyone */}
        <li>
          <Link href="/findwork" className={getLinkClass("/findwork")}>
            Find Work
          </Link>
        </li>

        {/* Always show Companies for everyone */}
        <li>
          <Link href="/company" className={getLinkClass("/company")}>
            Companies
          </Link>
        </li>

        {/* Only show Post Job and My Jobs for authenticated non-job seekers */}
        <li>
          <Link href="/job" className={getLinkClass("/job")}>
            Job
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Profile />
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href={"http://localhost:8000/login"}
              className="text-[#2f42c2] font-semibold border bg-[#2f42c2] text-white border-[#2f42c2] rounded-md py-2 px-6 flex items-center gap-4 hover:bg-[#2f42c2]/90 transition-all duration-200 ease-in-out"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href={"http://localhost:8000/login"}
              className="text-[#2f42c2] font-semibold border border-[#2f42c2] rounded-md py-2 px-6 flex items-center gap-4 hover:bg-[#2f42c2]/10 transition-all duration-200 ease-in-out"
            >
              <User className="w-4 h-4" />
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
