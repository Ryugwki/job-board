"use client";
import React, { useEffect, useState } from "react";
import { useJobsContext } from "@/context/jobsContext";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import Filters from "@/Components/Filters";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import {
  Heart,
  Plus,
  LayoutGrid,
  Rows,
  List,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { useGlobalContext } from "@/context/globalContext";
import { Separator } from "@/Components/ui/separator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/Components/ui/alert-dialog";

function JobPage() {
  const {
    filteredJobs,
    loading,
    getJobs,
    favorites,
    toggleFavorite,
    jobs,
    deleteJob,
  } = useJobsContext();

  const { userProfile, isAuthenticated } = useGlobalContext();
  // The type would be string, not "jobseeker"
  const userRoleValue = userProfile?.role
    ? String(userProfile.role).toLowerCase()
    : "";

  // Check if user is a recruiter (allowed to create jobs)
  const isRecruiter = userRoleValue === "recruiter";

  // Only recruiters can create jobs
  const canCreateJob = Boolean(isAuthenticated && userProfile && isRecruiter);

  const [userHasJobs, setUserHasJobs] = useState(false);
  const [userJobs, setUserJobs] = useState([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false); // Added for loading state fix
  const [loadingUserJobs, setLoadingUserJobs] = useState(false);

  const [columns, setColumns] = useState(3);

  // Fetch jobs on page load
  useEffect(() => {
    const loadJobs = async () => {
      await getJobs();
      setInitialLoadDone(true); // Mark load as complete regardless of result
    };

    loadJobs();
  }, [getJobs]);

  // Filter user jobs from all jobs
  useEffect(() => {
    if (isAuthenticated && userProfile && jobs.length > 0) {
      setLoadingUserJobs(true);

      // Filter jobs to find those created by the current user
      const userOwnedJobs = jobs.filter(
        (job) =>
          job.createdBy && String(job.createdBy._id) === String(userProfile._id)
      );

      setUserJobs(userOwnedJobs);
      setUserHasJobs(userOwnedJobs.length > 0);
      setLoadingUserJobs(false);
    }
  }, [isAuthenticated, userProfile, jobs]);

  // Cycle through 1, 2, 3 columns
  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  // Use Lucide icons instead of imported icons to avoid issues
  const getGridIcon = () => {
    if (columns === 3) return <LayoutGrid className="h-5 w-5" />;
    if (columns === 2) return <Rows className="h-5 w-5" />;
    return <List className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
            <div className="flex items-center gap-4">
              {canCreateJob && (
                <Link href="/job/create">
                  <Button className="bg-[#7263F3] hover:bg-[#7263F3]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Job
                  </Button>
                </Link>
              )}
              <span className="text-sm text-gray-500">
                {filteredJobs.length} jobs found
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleGridColumns}
                className="p-2"
              >
                {getGridIcon()}
              </Button>
            </div>
          </div>

          {/* User's Jobs Section - Only shown if the user has jobs */}
          {userHasJobs && isAuthenticated && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Jobs
                </h2>
                {userJobs.length > 3 && (
                  <Link href="/dashboard/jobs">
                    <Button variant="link" className="text-[#7263F3]">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>

              {loadingUserJobs ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7263F3] mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading your jobs...
                  </p>
                </div>
              ) : userJobs.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <p className="text-gray-500">
                    No jobs found. Create your first job now!
                  </p>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  {userJobs.slice(0, 3).map((job, index) => (
                    <React.Fragment key={job._id}>
                      {index > 0 && <Separator />}
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {job.logo ? (
                              <Image
                                src={job.logo}
                                alt={job.title}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    const fallback =
                                      document.createElement("div");
                                    fallback.className =
                                      "text-xl font-bold text-gray-400";
                                    fallback.textContent = job.title.charAt(0);
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-xl font-bold text-gray-400">
                                {job.title.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-grow">
                            <Link
                              href={`/job/${job._id}`}
                              className="text-lg font-medium hover:text-[#7263F3]"
                            >
                              {job.title}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {job.location || "No location"} •{" "}
                              {job.jobType || "No job type"}
                            </p>
                          </div>
                          <Link href={`/job/edit/${job._id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Job</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{job.title}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={() => deleteJob(job._id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  {userJobs.length > 3 && (
                    <div className="bg-gray-50 p-3 text-center">
                      <Link href="/dashboard/jobs">
                        <Button variant="link" className="text-[#7263F3]">
                          View all {userJobs.length} jobs
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full md:w-64 flex-shrink-0">
              <Filters />
            </div>

            {/* Jobs List */}
            <div className="flex-grow">
              {/* Fixed issue #2: Show loading only during initial load */}
              {loading && !initialLoadDone ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7263F3]"></div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">
                    No jobs found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                  {!loading && initialLoadDone && (
                    <p className="mt-4 text-sm text-gray-500">
                      {canCreateJob ? (
                        <span>
                          Be the first to{" "}
                          <Link
                            href="/job/create"
                            className="text-[#7263F3] hover:underline"
                          >
                            add a job
                          </Link>
                        </span>
                      ) : (
                        <span>Check back later for new jobs</span>
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    columns === 1
                      ? "grid-cols-1"
                      : columns === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      isFavorite={favorites.includes(job._id)}
                      onToggleFavorite={() => toggleFavorite(job._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Helper function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html, maxLength = 150) => {
  if (!html) return "";

  // Create a DOM element to safely parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Get text content
  const text = tempDiv.textContent || tempDiv.innerText || "";

  // Truncate and add ellipsis if needed
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// Job Card Component
function JobCard({ job, isFavorite, onToggleFavorite }) {
  const getJobType = (type) => {
    if (!type) return "N/A";
    // Fix the error by ensuring type is a string before using charAt
    const typeStr = String(type);
    return typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
  };

  // Get formatted description
  const formattedDescription = stripHtmlAndTruncate(job.description);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {job.logo ? (
                <Image
                  src={job.logo}
                  alt={job.title}
                  width={64}
                  height={64}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement("div");
                      fallback.className = "text-2xl font-bold text-gray-400";
                      fallback.textContent = job.title.charAt(0);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="text-2xl font-bold text-gray-400">
                  {job.title.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                <Link href={`/job/${job._id}`} className="hover:text-[#7263F3]">
                  {job.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">
                {job.location || "No location"}
              </p>
              {job.jobType && (
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  {job.jobType}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className="text-gray-400 hover:text-red-500"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        <div className="mt-4">
          {formattedDescription ? (
            <p className="text-sm text-gray-600 line-clamp-3">
              {formattedDescription}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No description available
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.jobType && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {getJobType(job.jobType)}
            </Badge>
          )}
          {job.salary && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {new Intl.NumberFormat().format(job.salary)} Salary
            </Badge>
          )}
          {new Date(job.createdAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              New
            </Badge>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          {job.website ? (
            <a
              href={
                job.website.startsWith("http")
                  ? job.website
                  : `https://${job.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#7263F3] hover:underline"
            >
              Visit Website
            </a>
          ) : (
            <span className="text-sm text-gray-400">No website available</span>
          )}
          <Link
            href={`/job/${job._id}`}
            className="text-sm font-medium text-[#7263F3] hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobPage;
