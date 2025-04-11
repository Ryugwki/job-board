import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Company from "../models/CompanyModel.js";

// Create a new company
export const createCompany = asyncHandler(async (req, res) => {
  try {
    // Authentication check - make sure we have valid Auth0 user
    if (!req.oidc || !req.oidc.user || !req.oidc.user.sub) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get the user from database using Auth0 ID
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      name,
      description,
      location,
      website,
      logo,
      size,
      industry,
      employees,
      technologies,
      marketPosition,
      marketFocus,
    } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const company = new Company({
      name,
      description,
      location,
      website,
      logo,
      size,
      industry,
      employees,
      technologies,
      marketPosition,
      marketFocus,
      createdBy: user._id,
    });

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.log("Error creating company", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all companies
export const getCompanies = asyncHandler(async (req, res) => {
  try {
    const companies = await Company.find({})
      .populate("createdBy", "name email")
      .sort({ createAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single company by ID
export const getCompanyById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id).populate(
      "createdBy",
      "name email profilePicture"
    );
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    console.error("Error getting company by id", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a company
export const updateCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (
      company.createdBy &&
      company.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this company" });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a company
export const deleteCompany = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await company.deleteOne({
      _id: id,
    });

    return res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Server error" });
  }
});
