"use client";
import Filters from "@/Components/Filters";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import SearchForm from "@/Components/SearchForm";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { grip, list, table } from "@/utils/Icons";
import Image from "next/image";
import React from "react";

function page() {
  const { jobs, filters } = useJobsContext();
  const [columns, setColumns] = React.useState(3);

  // Cycle through 1, 2, 3 columns
  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  const getIcon = () => {
    if (columns === 3) return grip;
    if (columns === 2) return table;
    return list;
  };

  const filteredJobs =
    filters.fullTime ||
    filters.partTime ||
    filters.contract ||
    filters.internship ||
    filters.fullStack ||
    filters.backend ||
    filters.devOps ||
    filters.uiUx
      ? jobs.filter((job: Job) => {
          if (filters.fullTime && job.jobType.includes("Full Time"))
            return true;
          if (filters.partTime && job.jobType.includes("Part Time"))
            return true;
          if (filters.contract && job.jobType.includes("Contract")) return true;
          if (filters.internship && job.jobType.includes("Internship"))
            return true;
          if (filters.fullStack && job.tags.includes("Full Stack")) return true;
          if (filters.backend && job.tags.includes("Backend")) return true;
          if (filters.devOps && job.tags.includes("DevOps")) return true;
          if (filters.uiUx && job.tags.includes("UI/UX")) return true;

          return false;
        })
      : jobs;

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <div className="relative px-16 bg-gradient-to-r from-[#D7DEDC] to-[#F3F4F6] overflow-hidden">
        <h1 className="py-8 text-black font-extrabold text-4xl leading-tight">
          Find Your <span className="text-[#2f42c2]">Next Job</span> Here
        </h1>

        <div className="pb-8 relative z-10">
          <SearchForm />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[90%] mx-auto mb-14">
        {/* Header Section */}
        <div className="flex justify-between items-center py-8">
          <h2 className="text-3xl font-bold text-black">Recent Jobs</h2>

          <button
            onClick={toggleGridColumns}
            className="flex items-center border border-gray-300 px-6 py-2 rounded-full font-medium bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>
              {columns === 3
                ? "Grid View"
                : columns === 2
                ? "Table View"
                : "List View"}
            </span>
            <span className="text-lg">{getIcon()}</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-1/4">
            <Filters />
          </div>

          {/* Job Listings */}
          <div
            className={`flex-1 grid gap-6 ${
              columns === 3
                ? "grid-cols-3"
                : columns === 2
                ? "grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {jobs.length > 0 ? (
              filteredJobs.map((job: Job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="mt-1 flex items-center justify-center col-span-full">
                <p className="text-2xl font-bold text-gray-500">
                  No Jobs Found!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default page;
