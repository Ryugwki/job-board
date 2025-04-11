"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { useGlobalContext } from "@/context/globalContext";
import { useCompanyContext } from "@/context/companyContext";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Heart,
  MapPin,
  Users,
  Globe,
  Briefcase,
  Edit,
  Trash2,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import axios from "axios";

function CompanyDetailPage() {
  const { companies, favorites, toggleFavorite, deleteCompany } =
    useCompanyContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [company, setCompany] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      // Check if company already exists in context
      const existingCompany = companies.find((c) => c._id === id);

      if (existingCompany) {
        setCompany(existingCompany);
        setIsFavorite(favorites.includes(id));
        setIsLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        const response = await axios.get(`/api/v1/companies/${id}`);
        setCompany(response.data);
        setIsFavorite(favorites.includes(id));
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id, companies, favorites]);

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (!company) return;

    toggleFavorite(company._id);
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  // Handle company deletion
  const handleDeleteCompany = async () => {
    if (!company || !isOwner) return;

    setIsDeleting(true);
    try {
      await deleteCompany(company._id);
      toast.success("Company deleted successfully");
      router.push("/company");
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error("Failed to delete company");
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if user owns this company
  const isOwner =
    userProfile &&
    company?.createdBy &&
    String(company.createdBy._id) === String(userProfile._id);

  if (isLoading || isDeleting) {
    return (
      <main>
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7263F3]"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !company) {
    return (
      <main>
        <Header />
        <div className="p-8 flex items-center justify-center h-[60vh]">
          <div className="text-center p-8 bg-white rounded-lg shadow max-w-md">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Briefcase size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
            <p className="mb-6">
              {error ||
                "The company you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/company">
              <Button className="bg-[#7263F3] hover:bg-[#7263F3]/90 text-white">
                Back to Companies
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
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
    createdBy,
    createdAt,
  } = company;

  // Rest of your component remains the same...

  return (
    <main>
      <Header />

      <div className="w-[90%] mx-auto py-8">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Your existing JSX for the company header */}
          {/* ... */}
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Your existing JSX for the content area */}
          {/* ... */}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default CompanyDetailPage;
