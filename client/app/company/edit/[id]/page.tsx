"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompanyContext } from "@/context/companyContext";
import { useGlobalContext } from "@/context/globalContext";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params?.id ? String(params.id) : null;

  const { updateCompany } = useCompanyContext();
  const { userProfile, isAuthenticated } = useGlobalContext();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    logo: "",
    location: "",
    industry: "",
    size: "",
    employees: "",
    technologies: [],
    marketFocus: "",
    marketPosition: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch company data directly with axios
  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;

      try {
        setIsLoading(true);
        // Use direct API call instead of context function
        const response = await axios.get(`/api/v1/companies/${companyId}`);
        const company = response.data;

        if (!company) {
          setError("Company not found");
          return;
        }

        // Check if current user is the owner
        if (
          !userProfile ||
          !company.createdBy ||
          String(company.createdBy._id) !== String(userProfile._id)
        ) {
          setError("You don't have permission to edit this company");
          return;
        }

        // Populate form with company data
        setFormData({
          name: company.name || "",
          description: company.description || "",
          website: company.website || "",
          logo: company.logo || "",
          location: company.location || "",
          industry: company.industry || "",
          size: company.size || "",
          employees: company.employees ? String(company.employees) : "",
          technologies: company.technologies || [],
          marketFocus: company.marketFocus || "",
          marketPosition: company.marketPosition || "",
        });
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to load company data");
        toast.error("Failed to load company data");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCompany();
    }
  }, [companyId, isAuthenticated, userProfile]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Company name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Company description is required";
    }

    if (
      formData.website &&
      !formData.website.match(
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
      )
    ) {
      errors.website = "Please enter a valid website URL";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.industry.trim()) {
      errors.industry = "Industry is required";
    }

    if (!formData.size) {
      errors.size = "Company size is required";
    }

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle technologies input (comma-separated)
  const handleTechChange = (e) => {
    const techs = e.target.value
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech !== "");

    setFormData((prev) => ({ ...prev, technologies: techs }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert employees to number if provided
      const dataToSubmit = {
        ...formData,
        employees: formData.employees
          ? parseInt(formData.employees)
          : undefined,
      };

      // If updateCompany is not available, use direct API call
      if (typeof updateCompany === "function") {
        await updateCompany(companyId, dataToSubmit);
      } else {
        await axios.put(`/api/v1/companies/edit/${companyId}`, dataToSubmit);
      }

      toast.success("Company updated successfully");
      router.push(`/company/${companyId}`); // Fixed: Redirect to company page, not edit page
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error("Failed to update company");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle loading state
  if (isLoading) {
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

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <Card className="w-full">
              <CardHeader className="bg-red-50 border-b border-red-100">
                <CardTitle className="text-red-700">Error</CardTitle>
                <CardDescription className="text-red-600">
                  {error}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Link href="/company">
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Companies
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href={`/company/${companyId}`}
              className="inline-flex items-center text-[#7263F3] hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Company
            </Link>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Edit Company</CardTitle>
              <CardDescription>Update your company information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className={formError.name ? "border-red-500" : ""}
                  />
                  {formError.name && (
                    <p className="text-sm text-red-500">{formError.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your company"
                    className={formError.description ? "border-red-500" : ""}
                    rows={6}
                  />
                  {formError.description && (
                    <p className="text-sm text-red-500">
                      {formError.description}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g., https://example.com"
                    className={formError.website ? "border-red-500" : ""}
                  />
                  {formError.website && (
                    <p className="text-sm text-red-500">{formError.website}</p>
                  )}
                </div>

                {/* Logo URL */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="Enter URL to your company logo"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, NY"
                    className={formError.location ? "border-red-500" : ""}
                  />
                  {formError.location && (
                    <p className="text-sm text-red-500">{formError.location}</p>
                  )}
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <Label htmlFor="industry">
                    Industry <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Technology, Healthcare"
                    className={formError.industry ? "border-red-500" : ""}
                  />
                  {formError.industry && (
                    <p className="text-sm text-red-500">{formError.industry}</p>
                  )}
                </div>

                {/* Company Size */}
                <div className="space-y-2">
                  <Label htmlFor="size">
                    Company Size <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) => handleSelectChange("size", value)}
                  >
                    <SelectTrigger
                      className={formError.size ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">
                        Small (1-50 employees)
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium (51-500 employees)
                      </SelectItem>
                      <SelectItem value="large">
                        Large (500+ employees)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formError.size && (
                    <p className="text-sm text-red-500">{formError.size}</p>
                  )}
                </div>

                {/* Number of Employees */}
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    name="employees"
                    type="number"
                    value={formData.employees}
                    onChange={handleChange}
                    placeholder="e.g., 250"
                  />
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies</Label>
                  <Input
                    id="technologies"
                    name="technologies"
                    value={formData.technologies.join(", ")}
                    onChange={handleTechChange}
                    placeholder="e.g., React, Node.js, Python (comma-separated)"
                  />
                  <p className="text-sm text-gray-500">
                    Enter technologies separated by commas
                  </p>
                </div>

                {/* Market Focus */}
                <div className="space-y-2">
                  <Label htmlFor="marketFocus">Market Focus</Label>
                  <Textarea
                    id="marketFocus"
                    name="marketFocus"
                    value={formData.marketFocus}
                    onChange={handleChange}
                    placeholder="Describe your company's market focus"
                    rows={3}
                  />
                </div>

                {/* Market Position */}
                <div className="space-y-2">
                  <Label htmlFor="marketPosition">Market Position</Label>
                  <Textarea
                    id="marketPosition"
                    name="marketPosition"
                    value={formData.marketPosition}
                    onChange={handleChange}
                    placeholder="Describe your company's market position"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#7263F3] hover:bg-[#7263F3]/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "Updating..." : "Update Company"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
