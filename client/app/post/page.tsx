"use client";

import react, { useEffect } from "react";
import Header from "@/Components/Header";
import JobForm from "@/Components/JobPost/JobForm";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter } from "next/navigation";

function page() {
  const { isAuthenticated, loading } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("http://localhost:8000/login");
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col">
      <Header />
      <h2 className="flex-1 pt-8 mx-auto w-[90%] text-3xl font-bold text-black">
        Create a job post
      </h2>
      <div className="flex-1 pt-8 mx-auto w-[90%] flex justify-center items-center">
        <JobForm />
      </div>
    </div>
  );
}
export default page;
