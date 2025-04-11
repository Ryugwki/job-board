"use client";

import React from "react";
import { useGlobalContext } from "@/context/globalContext";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Image } from "lucide-react";

function CompanyDetails() {
  const {
    website,
    setWebsite,
    logo,
    setLogo,
    companySize,
    setCompanySize,
    employees,
    setEmployees,
  } = useGlobalContext();

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogo(e.target.value);
  };

  const handleEmployeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployees(e.target.value);
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-background border border-border rounded-lg">
      {/* Website URL Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Company Website</h3>
          <Label
            htmlFor="website"
            className="text-sm text-muted-foreground mt-2"
          >
            Enter your company's official website URL.
          </Label>
        </div>
        <div>
          <Input
            type="url"
            id="website"
            placeholder="https://example.com"
            value={website}
            onChange={handleWebsiteChange}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="my-2" />

      {/* Logo URL Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Company Logo</h3>
          <Label htmlFor="logo" className="text-sm text-muted-foreground mt-2">
            Enter a URL for your company logo (Square image recommended).
          </Label>
        </div>
        <div>
          <div className="flex gap-4 items-center">
            <Input
              type="url"
              id="logo"
              placeholder="https://example.com/logo.png"
              value={logo}
              onChange={handleLogoChange}
              className="flex-1"
            />
            {logo && (
              <div className="w-12 h-12 border rounded-md flex items-center justify-center overflow-hidden">
                <img
                  src={logo}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-logo.png";
                  }}
                />
              </div>
            )}
            {!logo && (
              <div className="w-12 h-12 border rounded-md flex items-center justify-center bg-gray-100">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Company Size Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Company Size</h3>
          <Label
            htmlFor="companySize"
            className="text-sm text-muted-foreground mt-2"
          >
            Select the category that best describes your company's size.
          </Label>
        </div>
        <div>
          <Select value={companySize} onValueChange={setCompanySize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (1-50 employees)</SelectItem>
              <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
              <SelectItem value="large">Large (251-1000 employees)</SelectItem>
              <SelectItem value="enterprise">
                Enterprise (1000+ employees)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Employee Count Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold">Number of Employees</h3>
          <Label
            htmlFor="employees"
            className="text-sm text-muted-foreground mt-2"
          >
            Enter the approximate number of employees in your company.
          </Label>
        </div>
        <div>
          <Input
            type="number"
            id="employees"
            placeholder="Enter employee count"
            value={employees}
            onChange={handleEmployeesChange}
            min="1"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;
