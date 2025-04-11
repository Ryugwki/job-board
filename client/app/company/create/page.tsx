"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import CompanyForm from "@/Components/CompanyPost/CompanyForm";
import { useGlobalContext } from "@/context/globalContext";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

function CreateCompanyPage() {
  const router = useRouter();
  const { userProfile, isAuthenticated, isLoading } = useGlobalContext();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is authorized to create a company
  useEffect(() => {
    // Wait for authentication to complete
    if (isLoading) return;

    setCheckingAuth(true);

    // Check authentication
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a company");
      router.push("/");
      return;
    }

    // Safety check for userProfile
    if (!userProfile) {
      toast.error("Unable to load user profile");
      router.push("/");
      return;
    }

    // Check profession
    const { profession = "" } = userProfile;
    const isJobSeeker = profession?.toLowerCase() === "job seeker";

    if (isJobSeeker) {
      toast.error("Only recruiters or employers can create company profiles");
      router.push("/company");
      return;
    }

    // User is authorized
    setAuthorized(true);
    setCheckingAuth(false);
  }, [isAuthenticated, userProfile, router, isLoading]);

  // Show loading state while checking authorization
  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#2f42c2]" />
            <p className="mt-4 text-gray-600">Checking authorization...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Only render the form if authorized
  if (!authorized) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Create Company Profile
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill out the details below to create a new company profile.
              Complete information helps job seekers find your company more
              easily.
            </p>
          </div>

          <CompanyForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CreateCompanyPage;
