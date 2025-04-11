"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

// Define the company interface
export interface Company {
  _id: string;
  name: string;
  description: string;
  location?: string;
  website?: string;
  logo?: string;
  rating?: number;
  size?: string;
  createdAt: string;
  createdBy?: {
    _id: string;
    name?: string;
  };
  industry?: string;
  employees?: number;
}

// Define the component props
interface CompanyCardProps {
  company: Company;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  variant?: "default" | "compact" | "detailed";
  showActions?: boolean;
  className?: string;
}

// Helper function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html: string | undefined, maxLength = 150) => {
  if (!html) return "";

  // Create a DOM element to safely parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Get text content
  const text = tempDiv.textContent || tempDiv.innerText || "";

  // Truncate and add ellipsis if needed
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// Helper function to format number with commas
const formatNumber = (num: number | undefined) => {
  if (num === undefined) return "Unspecified";
  return new Intl.NumberFormat().format(num);
};

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  isFavorite = false,
  onToggleFavorite,
  variant = "default",
  showActions = true,
  className = "",
}) => {
  // Helper function to format company size
  const getCompanySize = (size?: string) => {
    if (!size) return "N/A";
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  // Check if company was created in the last 30 days
  const isNewlyAdded = (createdAt: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
  };

  // Determine description length based on variant
  const getDescriptionClass = () => {
    switch (variant) {
      case "compact":
        return "line-clamp-1";
      case "detailed":
        return ""; // No line clamp for detailed view
      default:
        return "line-clamp-3";
    }
  };

  const formattedDescription = stripHtmlAndTruncate(
    company.description,
    variant === "compact" ? 100 : variant === "detailed" ? 500 : 150
  );

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className={`p-6 ${variant === "compact" ? "p-4" : ""}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div
              className={`${
                variant === "compact" ? "h-12 w-12" : "h-16 w-16"
              } rounded-full overflow-hidden bg-gray-100 flex items-center justify-center`}
            >
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={variant === "compact" ? 48 : 64}
                  height={variant === "compact" ? 48 : 64}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = document.createElement("div");
                      fallback.className =
                        variant === "compact"
                          ? "text-xl font-bold text-gray-400"
                          : "text-2xl font-bold text-gray-400";
                      fallback.textContent = company.name.charAt(0);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div
                  className={`${
                    variant === "compact" ? "text-xl" : "text-2xl"
                  } font-bold text-gray-400`}
                >
                  {company.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3
                className={`${
                  variant === "compact" ? "text-base" : "text-lg"
                } font-semibold text-gray-900`}
              >
                <Link
                  href={`/company/${company._id}`}
                  className="hover:text-[#7263F3]"
                >
                  {company.name}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">
                {company.location || "No location specified"}
              </p>
              {company.industry && (
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  {company.industry}
                </p>
              )}
            </div>
          </div>

          {onToggleFavorite && showActions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorite}
              className="text-gray-400 hover:text-red-500"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          )}
        </div>

        {(variant !== "compact" || variant === "detailed") && (
          <div className="mt-4">
            {formattedDescription ? (
              <p className={`text-sm text-gray-600 ${getDescriptionClass()}`}>
                {formattedDescription}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No description available
              </p>
            )}
          </div>
        )}

        <div
          className={`${
            variant === "compact" ? "mt-2" : "mt-4"
          } flex flex-wrap gap-2`}
        >
          {company.createdAt && isNewlyAdded(company.createdAt) && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              New
            </Badge>
          )}

          {company.size && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              {getCompanySize(company.size)}
            </Badge>
          )}

          {company.employees && (
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200"
            >
              {formatNumber(company.employees)} Employees
            </Badge>
          )}

          {/* Rating display removed as requested */}
        </div>

        {showActions && (
          <div
            className={`${
              variant === "compact" ? "mt-2" : "mt-6"
            } flex justify-between items-center`}
          >
            {company.website ? (
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#7263F3] hover:underline"
              >
                Visit Website
              </a>
            ) : (
              <span className="text-sm text-gray-400">
                No website available
              </span>
            )}

            {variant !== "detailed" && (
              <Link
                href={`/company/${company._id}`}
                className="text-sm font-medium text-[#7263F3] hover:underline"
              >
                View Details
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;
