import express from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controller/companyController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/companies", protect, createCompany); // Create a company
router.get("/companies", getCompanies); // Get all companies
router.get("/companies/:id", getCompanyById); // Get a single company by ID
router.put("/companies/edit/:id", protect, updateCompany); // Update a company
router.delete("/companies/:id", protect, deleteCompany); // Delete a company

export default router;
