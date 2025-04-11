"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const JobsContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const JobsContextProvider = ({ children }) => {
  const { userProfile, getUserProfile } = useGlobalContext();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userJobs, setUserJobs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [searchQuery, setSearchQuery] = useState({
    title: "",
    location: "",
    jobType: "",
  });
  const [filters, setFilters] = useState({
    topRated: false,
    newlyAdded: false,
    fullTime: false,
    partTime: false,
    contract: false,
    remote: false,
    fullStack: false,
    frontend: false,
    backend: false,
    devOps: false,
    uiUx: false,
  });

  // State for sorting
  const [sortBy, setSortBy] = useState("newest");

  // State for salary range filtering
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(200000);

  // Toggle favorites only view
  const toggleShowFavoritesOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  // Change sort method
  const changeSortMethod = (method) => {
    setSortBy(method);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      topRated: false,
      newlyAdded: false,
      fullTime: false,
      partTime: false,
      contract: false,
      remote: false,
      fullStack: false,
      frontend: false,
      backend: false,
      devOps: false,
      uiUx: false,
    });
    setSearchQuery({ title: "", location: "" });
    setShowFavoritesOnly(false);
    setSortBy("newest");
    setMinSalary(0);
    setMaxSalary(200000);
  };

  // Fetch all jobs
  const getJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs");
      setJobs(res.data);
      setFilteredJobs(res.data);
    } catch (error) {
      console.log("Error getting jobs", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new job
  const createJob = async (jobData) => {
    try {
      const res = await axios.post("/api/v1/jobs", jobData);

      toast.success("Job created successfully");

      setJobs((prevJobs) => [res.data, ...prevJobs]);
      setFilteredJobs((prevJobs) => [res.data, ...prevJobs]);

      // update userJobs
      if (userProfile?._id) {
        setUserJobs((prevUserJobs) => [res.data, ...prevUserJobs]);
        await getUserJobs(userProfile._id);
      }

      await getJobs();
      // redirect to the job details page
      router.push(`/job/${res.data._id}`);
    } catch (error) {
      console.error("Error creating job", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create job";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a job
  const updateJob = async (id, jobData) => {
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error("Job ID is required for updates");
      }

      console.log("Updating job with data:", jobData);

      const response = await axios.put(`/api/v1/jobs/edit/${id}`, jobData);
      const updatedJob = response.data;

      setJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, ...updatedJob } : job))
      );

      setFilteredJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, ...updatedJob } : job))
      );

      toast.success("Job updated successfully!");
      return updatedJob;
    } catch (err) {
      console.error("Error updating job:", err);
      const errorDetails =
        err.response?.data?.message || err.message || "Failed to update job";
      setError(errorDetails);
      toast.error(errorDetails);
      throw err; // Re-throw to allow handling in components
    } finally {
      setLoading(false);
    }
  };

  // Delete a job
  const deleteJob = async (id) => {
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error("Job ID is required for deletion");
      }

      console.log("Deleting job with ID:", id);
      await axios.delete(`/api/v1/jobs/${id}`);

      setJobs((prev) => prev.filter((job) => job._id !== id));
      setFilteredJobs((prev) => prev.filter((job) => job._id !== id));

      // Also remove from favorites if present
      setFavorites((prev) => prev.filter((favId) => favId !== id));

      toast.success("Job deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting job:", err);
      const errorDetails =
        err.response?.data?.message || err.message || "Failed to delete job";
      setError(errorDetails);
      toast.error(errorDetails);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get jobs created by a specific user
  const getUserJobs = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs/user/" + userId);
      setUserJobs(res.data);
    } catch (error) {
      console.log("Error getting user jobs", error);
    } finally {
      setLoading(false);
    }
  };

  // Get job by id
  const getJobById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/jobs/${id}`);
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Error getting job by id", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply for a job
  const applyToJob = async (id) => {
    try {
      const res = await axios.put(`/api/v1/jobs/apply/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error applying to job", error);
      throw error;
    }
  };

  // Like or unlike a job
  const likeJob = async (id) => {
    try {
      const res = await axios.put(`/api/v1/jobs/like/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error liking job", error);
      throw error;
    }
  };

  // Search jobs function
  const searchJobs = (title = "", location = "") => {
    setLoading(true);
    try {
      // If search params are provided, use them, otherwise use current searchQuery state
      const searchTitle = title !== undefined ? title : searchQuery.title;
      const searchLocation =
        location !== undefined ? location : searchQuery.location;

      // Update searchQuery state
      setSearchQuery({ title: searchTitle, location: searchLocation });

      // Apply filters and search
      applyFiltersAndSearch(searchTitle, searchLocation);
    } catch (err) {
      console.error("Error searching jobs:", err);
      setError(err.message || "Failed to search jobs");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (searchName, value) => {
    setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
  };

  // Handle filter change
  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  // Toggle job favorite status
  const toggleFavorite = (jobId) => {
    setFavorites((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Apply filters and search function
  const applyFiltersAndSearch = (
    title = searchQuery.title,
    location = searchQuery.location
  ) => {
    let results = [...jobs];

    // Apply search by title
    if (title) {
      results = results.filter((job) =>
        job.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    // Apply search by location
    if (location) {
      results = results.filter((job) =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply salary range filter
    if (minSalary > 0 || maxSalary < 200000) {
      results = results.filter((job) => {
        if (!job.salary) return false;
        return job.salary >= minSalary && job.salary <= maxSalary;
      });
    }

    // Apply filters
    if (Object.values(filters).some((value) => value)) {
      const filteredResults = [];

      for (const job of results) {
        if (filters.topRated && job.rating >= 4) {
          filteredResults.push(job);
          continue;
        }

        if (filters.newlyAdded && isNewlyAdded(job.createdAt)) {
          filteredResults.push(job);
          continue;
        }

        if (filters.fullTime && job.jobType?.includes("Full Time")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.partTime && job.jobType?.includes("Part Time")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.contract && job.jobType?.includes("Contract")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.remote && job.jobType?.includes("Remote")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.fullStack && job.tags?.includes("Full Stack")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.frontend && job.tags?.includes("Frontend")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.backend && job.tags?.includes("Backend")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.devOps && job.tags?.includes("DevOps")) {
          filteredResults.push(job);
          continue;
        }

        if (filters.uiUx && job.tags?.includes("UI/UX")) {
          filteredResults.push(job);
          continue;
        }
      }

      results = filteredResults;
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      results = results.filter((job) => favorites.includes(job._id));
    }

    // Apply sorting
    results = sortJobs(results, sortBy);

    // Update filtered jobs
    setFilteredJobs(results);
  };

  // Helper function to check if a job was added recently (e.g., within the last 30 days)
  const isNewlyAdded = (createdAt) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
  };

  // Helper function to sort jobs
  const sortJobs = (jobsToSort, sortMethod) => {
    switch (sortMethod) {
      case "title":
        return [...jobsToSort].sort((a, b) => a.title.localeCompare(b.title));
      case "titleDesc":
        return [...jobsToSort].sort((a, b) => b.title.localeCompare(a.title));
      case "salary":
        return [...jobsToSort].sort((a, b) => b.salary - a.salary);
      case "salaryDesc":
        return [...jobsToSort].sort((a, b) => a.salary - b.salary);
      case "newest":
        return [...jobsToSort].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return [...jobsToSort].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return jobsToSort;
    }
  };

  // Effect to apply filters when jobs, filters, search query, or sort method changes
  useEffect(() => {
    if (jobs.length > 0) {
      applyFiltersAndSearch();
    }
  }, [jobs, filters, sortBy, showFavoritesOnly, minSalary, maxSalary]);

  // Load jobs when the component mounts
  useEffect(() => {
    getJobs();

    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem("favoriteJobs");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favoriteJobs", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        filteredJobs,
        loading,
        error,
        getJobs,
        createJob,
        updateJob,
        deleteJob,
        searchJobs,
        handleSearchChange,
        searchQuery,
        handleFilterChange,
        filters,
        favorites,
        toggleFavorite,
        showFavoritesOnly,
        toggleShowFavoritesOnly,
        sortBy,
        changeSortMethod,
        clearAllFilters,
        applyToJob,
        likeJob,
        getUserJobs,
        userJobs,
        minSalary,
        maxSalary,
        setMinSalary,
        setMaxSalary,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

// Custom hook to use the JobsContext
export const useJobsContext = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobsContext must be used within a JobsProvider");
  }
  return context;
};
