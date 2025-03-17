import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";

//Create job
export const createJobs = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    const isAuth = req.oidc.isAuthenticated() || user.email;

    if (!isAuth) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const {
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
    } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
    if (!salary) {
      return res.status(400).json({ message: "Salary is required" });
    }
    if (!jobType) {
      return res.status(400).json({ message: "Job type is required" });
    }
    if (!tags) {
      return res.status(400).json({ message: "Tags are required" });
    }
    if (!skills) {
      return res.status(400).json({ message: "Skills are required" });
    }
    //     if (!salaryType) {
    //       return res.status(400).json({ message: "Salary type is required" });
    //     }
    //     if (!negotiable) {
    //       return res.status(400).json({ message: "Negotiable is required" });
    //     }
    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      tags,
      skills,
      salaryType,
      negotiable,
      createdBy: user._id,
    });
    await job.save();

    return res.status(201).json(job);
  } catch (error) {
    console.log("Error creating job", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//Get all jobs
export const getJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("createdBy", "name email profilePicture")
      .sort({ createAt: -1 }); //Sort by latest
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error getting jobs", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//Get jobs by user
export const getJobsByUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const jobs = await Job.find({ createdBy: user._id })
      .populate("createdBy", "name email profilePicture")
      .sort({ createAt: -1 }); //Sort by latest
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error getting jobs by user", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//Search jobs
export const searchJobs = asyncHandler(async (req, res) => {
  try {
    const { tags, location, title } = req.query;

    let query = {};

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const jobs = await Job.find(query).populate(
      "createdBy",
      "name email profilePicture"
    );

    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error searching jobs", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//Apply for jobs
export const applyJobs = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (job.applicants.includes(user._id)) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    job.applicants.push(user._id);

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error applying for job", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//Like and unlike jobs
export const likeJobs = asyncHandler(async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isLiked = job.likes.includes(user._id);

    if (isLiked) {
      job.likes = job.likes.filter((like) => !like.equals(user._id));
    } else {
      job.likes.push(user._id);
    }

    await job.save();

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error liking job", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//Get job by ID
export const getJobById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate(
      "createdBy",
      "name email profilePicture"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.log("Error getting job by ID", error);
    return res.status(500).json({ message: "Server error" });
  }
});
//Delete jobs
export const deleteJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await job.deleteOne({
      _id: id,
    });

    return res.status(200).json({ message: "Job deleted" });
  } catch (error) {
    console.log("Error deleting job", error);
    return res.status(500).json({ message: "Server error" });
  }
});
