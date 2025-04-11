"use client";

import { useGlobalContext } from "@/context/globalContext";
import React, { useState } from "react";
import CompanyTitle from "./CompanyTitle";
import CompanyDetails from "./CompanyDetails"; // Changed to single component
import CompanyIndustry from "./CompanyIndustry";
import CompanyLocation from "./CompanyLocation";
import { useCompanyContext } from "@/context/companyContext";

function CompanyForm() {
  const {
    companyName,
    companyDescription,
    website,
    logo,
    companySize,
    industry,
    employees,
    location,
  } = useGlobalContext();

  const { createCompany } = useCompanyContext();
  const sections = [
    "About", // Changed from "Company Title"
    "Details", // Changed from "Company Details"
    "Industry",
    "Location",
    "Review",
  ];
  const [currentSection, setCurrentSection] = useState(sections[0]);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const renderStages = () => {
    switch (currentSection) {
      case "About": // Changed from "Company Title"
        return <CompanyTitle />;
      case "Details": // Changed from "Company Details"
        return <CompanyDetails />;
      case "Industry":
        return <CompanyIndustry />;
      case "Location":
        return <CompanyLocation />;
      case "Review":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              Review Company Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Company Name</h4>
                <p>{companyName}</p>
              </div>
              <div>
                <h4 className="font-medium">Company Size</h4>
                <p>{companySize}</p>
              </div>
              <div>
                <h4 className="font-medium">Industry</h4>
                <p>{industry}</p>
              </div>
              <div>
                <h4 className="font-medium">Employees</h4>
                <p>{employees}</p>
              </div>
              <div>
                <h4 className="font-medium">Website</h4>
                <p>{website || "Not provided"}</p>
              </div>
              <div>
                <h4 className="font-medium">Location</h4>
                <p>
                  {location.address && `${location.address}, `}
                  {location.city && `${location.city}, `}
                  {location.country}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="whitespace-pre-wrap">{companyDescription}</p>
            </div>
          </div>
        );
    }
  };

  const getCompletedColor = (section: string) => {
    switch (section) {
      case "About": // Changed from "Company Title"
        return companyName ? "bg-[#2f42c2] text-white" : "bg-gray-300";
      case "Details": // Changed from "Company Details"
        return companyDescription && companySize
          ? "bg-[#2f42c2] text-white"
          : "bg-gray-300";
      case "Industry":
        return industry ? "bg-[#2f42c2] text-white" : "bg-gray-300";
      case "Location":
        return location.address || location.city || location.country
          ? "bg-[#2f42c2] text-white"
          : "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCompany({
      name: companyName,
      description: companyDescription,
      website,
      logo,
      size: companySize,
      industry,
      employees: parseInt(employees),
      location: `${location.address}, ${location.city}, ${location.country}`,
    });
  };

  return (
    <div className="w-full flex gap-6">
      <div className="self-start w-[10rem] flex flex-col bg-white rounded-md shadow-sm overflow-hidden">
        {sections.map((section, index) => (
          <button
            className={`pl-4 py-3 relative flex self-start items-center font-medium gap-2
            ${currentSection === section ? "text-[#2f42c2]" : "text-gray-500"}`}
            key={index}
            onClick={() => handleSectionChange(section)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center border border-gray-400/60 justify-center text-gray-500
                     ${
                       currentSection === section ? "text-white" : ""
                     } ${getCompletedColor(section)}`}
            >
              {index + 1}
            </span>
            {section}
            {currentSection === section && (
              <span className="w-1 h-full absolute left-0 top-0 bg-[#2f42c2] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      <form
        action=""
        className="p-6 flex-1 bg-white rounded-lg self-start"
        onSubmit={handleSubmit}
      >
        {renderStages()}
        <div className="flex justify-end gap-4 mt-4">
          {currentSection !== "Review" && (
            <button
              type="button"
              className="px-6 py-2 bg-[#2f42c2] text-white rounded-md"
              onClick={() => {
                const currentIndex = sections.indexOf(currentSection);
                setCurrentSection(sections[currentIndex + 1]);
              }}
            >
              Next
            </button>
          )}
        </div>
        {currentSection === "Review" && (
          <button
            type="submit"
            className="self-end px-6 py-2 bg-[#2f42c2] text-white rounded-md"
          >
            Create Company
          </button>
        )}
      </form>
    </div>
  );
}

export default CompanyForm;
