"use client";

import React, { useEffect, useState } from "react";
import { useCompanyContext } from "@/context/companyContext";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/Components/ui/button";
import { Plus, Edit, Trash2, Building, ArrowLeft } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "@/context/globalContext";
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

function MyCompaniesPage() {
  const { companies, loading, fetchCompanies, deleteCompany } =
    useCompanyContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const [myCompanies, setMyCompanies] = useState([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  // Fetch companies and filter for user's companies
  useEffect(() => {
    const loadCompanies = async () => {
      await fetchCompanies();
      setInitialLoadDone(true);
    };

    loadCompanies();
  }, [fetchCompanies]);

  // Filter companies owned by the current user
  useEffect(() => {
    if (userProfile && companies.length > 0) {
      const filtered = companies.filter(
        (company) =>
          company.createdBy && company.createdBy._id === userProfile._id
      );
      setMyCompanies(filtered);
    }
  }, [companies, userProfile]);

  // Handler for deleting a company
  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompany(companyToDelete);
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error("Failed to delete company");
    }

    setCompanyToDelete(null);
  };

  // Render loading state
  if (loading && !initialLoadDone) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7263F3]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-gray-50 flex justify-center items-center">
          <div className="text-center p-8 bg-white rounded-lg shadow max-w-md">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="mb-6">Please sign in to view your companies.</p>
            <Link href="http://localhost:8000/login">
              <Button className="bg-[#7263F3] hover:bg-[#7263F3]/90 text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link href="/company">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">My Companies</h1>
            </div>
            <Link href="/company/create">
              <Button className="bg-[#7263F3] hover:bg-[#7263F3]/90 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Company
              </Button>
            </Link>
          </div>

          {myCompanies.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No companies found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                You haven't created any companies yet.
              </p>
              <div className="mt-6">
                <Link href="/company/create">
                  <Button className="bg-[#7263F3] hover:bg-[#7263F3]/90 text-white">
                    Create Your First Company
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {myCompanies.map((company, index) => (
                <div key={company._id}>
                  {index > 0 && <Separator />}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        {company.logo ? (
                          <Image
                            src={company.logo}
                            alt={company.name}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        ) : (
                          <div className="text-2xl font-bold text-gray-400">
                            {company.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="flex-grow">
                        <Link href={`/company/${company._id}`}>
                          <h2 className="text-xl font-semibold text-gray-900 hover:text-[#7263F3]">
                            {company.name}
                          </h2>
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {company.industry && (
                            <Badge variant="outline" className="capitalize">
                              {company.industry}
                            </Badge>
                          )}
                          {company.size && (
                            <Badge variant="outline" className="capitalize">
                              {company.size} company
                            </Badge>
                          )}
                          {company.location && (
                            <Badge variant="outline">{company.location}</Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {company.description
                            ?.replace(/<[^>]*>/g, "")
                            .substring(0, 150)}
                          {company.description?.length > 150 ? "..." : ""}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Link href={`/company/edit/${company._id}`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setCompanyToDelete(company._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Company
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{company.name}
                                "? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setCompanyToDelete(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={handleDeleteCompany}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default MyCompaniesPage;
