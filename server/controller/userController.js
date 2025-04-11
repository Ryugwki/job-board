import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Check if the requesting user is an admin (if you have auth middleware)
    if (req.user && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to access user list" });
    }

    // Fetch all users
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    //Find user by id
    const user = await User.findOne({ auth0Id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user profile", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // This is the MongoDB `_id`
    const updatedData = req.body;

    // Find the user by `_id` and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      id, // Use MongoDB `_id` to find the user
      updatedData,
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const setUserAdminStatus = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin } = req.body;

    // First check if the requesting user is an admin
    const requestingUser = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!requestingUser || !requestingUser.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating admin status:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
