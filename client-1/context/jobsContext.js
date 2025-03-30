import React, { createContext, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "@/context/globalContext";
import axios from "axios";
import toast from "react-hot-toast";

const JobsContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const JobsContextProvider = ({ children }) => {
  const { userProfile } = useGlobalContext();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userJobs, setUserJobs] = useState([]);

  const getJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs");
      setJobs(res.data);
    } catch (error) {
      console.log("Error getting jobs", error);
    } finally {
      setLoading(false);
    }
    return;
  };

  const createJob = async (jobData) => {
    setLoading(true);
    try {
      const res = await axios.post("api/v1/jobs", jobData);

      toast.success("Job created successfully");

      setJobs((prevJobs) => [...prevJobs, res.data]);

      //Update jobs

      if (userProfile.id) {
        setUserJobs((prevJobs) => [...prevJobs, res.data]);
      }
    } catch (error) {
      console.log("Error creating job", error);
    }
  };

  const getUserJobs = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/jobs/user" + userId);

      setUserJobs(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error getting user jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async (tags, location, title) => {
    setLoading(true);
    try {
      //Query string
      const query = new URLSearchParams();
      if (tags) query.append("tags", tags);
      if (tags) query.append("location", location);
      if (tags) query.append("title", title);

      //Send request
      const res = await axios.get(`/api/v1/jobs/search?${query.toString()}`);

      //Set jobs to res data
      setJobs(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error searching jobs", error);
    } finally {
      setLoading(false);
    }
  };

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

  const likeJob = async (jobId) => {
    try {
      const res = axios.put(`/api/v1/jobs/like/${jobId}`);
      toast.success("Job liked successfully");

      getJobs();
      return res.data;
    } catch (error) {
      console.log("Error liking job", error);
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId) => {
    setLoading(true);
    try {
      const res = axios.put(`/api/v1/jobs/apply/${jobId}`);
      toast.success("Applied to job successfully");

      getJobs();
      return res.data;
    } catch (error) {
      console.log("Error applying to job", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/v1/jobs/${jobId}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      searchJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully");
    } catch (error) {
      console.log("Error deleting job", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (userProfile.id) {
      getUserJobs(userProfile.id);
    }
  }, [userProfile]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        loading,
        createJob,
        userJobs,
        searchJobs,
        getJobById,
        likeJob,
        applyToJob,
        deleteJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobsContext = () => {
  return useContext(JobsContext);
};
