import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      unique: true,
      type: String,
      required: true,
    },
    auth0Id: {
      unique: true,
      type: String,
      required: true,
    },
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    role: [
      {
        type: String,
        enum: ["job seeker", "recruiter"],
        default: "job seeker",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resume: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      default: "No bio provided",
    },
    profession: {
      type: String,
      default: "Unemployed",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
