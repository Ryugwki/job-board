import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    logo: {
      type: String,
    },
    size: {
      type: String,
    },
    industry: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    employees: {
      type: Number,
      default: 0,
    },
    technologies: {
      type: [String],
      default: [],
    },
    marketPosition: {
      type: String,
    },
    marketFocus: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Company = mongoose.model("Company", CompanySchema);

export default Company;
