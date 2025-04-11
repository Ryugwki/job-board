"use client";

import React, { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";

function Settings() {
  const {
    userProfile,
    getUserProfile,
    updateUserProfile,
    isAuthenticated,
    loading,
  } = useGlobalContext();
  const router = useRouter(); // Use Next.js router for navigation
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profession: "Unemployed",
    role: "Job seeker",
    bio: "",
    profilePicture: "/user.png",
  });

  // Fetch user profile on page load
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        profession: userProfile.profession || "Unemployed",
        role: userProfile.role || "Job seeker",
        bio: userProfile.bio || "",
        profilePicture: userProfile.profilePicture || "/user.png",
      });
    }
  }, [isAuthenticated, userProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Compress the image
        const options = {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // Convert the compressed file to Base64
        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prev) => ({
            ...prev,
            profilePicture: reader.result as string,
          }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Failed to compress image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      toast.success("Profile updated successfully!");

      // Redirect to the home page after successful update
      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="w-[90%] mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <Image
            src={formData.profilePicture}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full border"
          />
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
            <label>
              <Button
                type="button"
                className="mt-2 px-4 py-2 bg-[#7263F3] text-white rounded-md"
                onClick={() =>
                  document.getElementById("profilePicture")?.click()
                }
              >
                Upload Picture
              </Button>
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled
          />
        </div>

        {/* Profession */}
        <div>
          <label
            htmlFor="profession"
            className="block text-sm font-medium text-gray-700"
          >
            Profession
          </label>
          <Select
            value={formData.profession}
            onValueChange={(value) => handleSelectChange("profession", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Employee">Employee</SelectItem>
              <SelectItem value="Employer">Employer</SelectItem>
              <SelectItem value="Unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <Select
            value={formData.role}
            onValueChange={(value) => handleSelectChange("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Job seeker">Job seeker</SelectItem>
              <SelectItem value="Recruiter">Recruiter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Write a short bio about yourself"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-6 py-2 bg-[#7263F3] text-white rounded-md"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
