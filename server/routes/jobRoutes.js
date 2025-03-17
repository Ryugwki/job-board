import express from "express";
import {
  createJobs,
  getJobs,
  getJobsByUser,
  searchJobs,
  applyJobs,
  likeJobs,
  getJobById,
  deleteJob,
} from "../controller/jobController.js";
import protect from "../middleware/protect.js";

const router = express.Router();
//Create job
router.post("/jobs", protect, createJobs);

//Get jobs
router.get("/jobs", getJobs);

//Get jobs by user
router.get("/jobs/user/:id", protect, getJobsByUser);

//Search jobs
router.get("/jobs/search", searchJobs);

//Apply for jobs
router.put("/jobs/apply/:id", protect, applyJobs);

//Like or dislike job
router.put("/jobs/like/:id", protect, likeJobs);

//Get job by ID
router.get("/jobs/:id", protect, getJobById);

//Delete job
router.delete("/jobs/:id", protect, deleteJob);

export default router;
