"use client";
import React from "react";
import { useJobsContext } from "@/context/jobsContext";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

function JobFilters() {
  const {
    searchQuery,
    handleSearchChange,
    searchJobs,
    filters,
    handleFilterChange,
    clearAllFilters,
    showFavoritesOnly,
    toggleShowFavoritesOnly,
    sortBy,
    changeSortMethod,
    minSalary,
    maxSalary,
    setMinSalary,
    setMaxSalary,
  } = useJobsContext();

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          searchJobs();
        }}
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search job title"
            value={searchQuery.title}
            onChange={(e) => handleSearchChange("title", e.target.value)}
            className="w-full py-2 pl-10 pr-4 border rounded-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Location"
            value={searchQuery.location}
            onChange={(e) => handleSearchChange("location", e.target.value)}
            className="w-full py-2 px-4 border rounded-md"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Filters */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700"
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        </div>

        <div className="mt-4 space-y-3">
          {/* Job Type Filters */}
          <h3 className="text-sm font-medium text-gray-600">Job Type</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fullTime"
              checked={filters.fullTime}
              onCheckedChange={() => handleFilterChange("fullTime")}
            />
            <Label htmlFor="fullTime">Full Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="partTime"
              checked={filters.partTime}
              onCheckedChange={() => handleFilterChange("partTime")}
            />
            <Label htmlFor="partTime">Part Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contract"
              checked={filters.contract}
              onCheckedChange={() => handleFilterChange("contract")}
            />
            <Label htmlFor="contract">Contract</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internship"
              checked={filters.internship}
              onCheckedChange={() => handleFilterChange("internship")}
            />
            <Label htmlFor="internship">Internship</Label>
          </div>

          {/* Job Category Filters */}
          <h3 className="text-sm font-medium text-gray-600 mt-4">
            Job Category
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fullStack"
              checked={filters.fullStack}
              onCheckedChange={() => handleFilterChange("fullStack")}
            />
            <Label htmlFor="fullStack">Full Stack</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="frontend"
              checked={filters.frontend}
              onCheckedChange={() => handleFilterChange("frontend")}
            />
            <Label htmlFor="frontend">Frontend</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="backend"
              checked={filters.backend}
              onCheckedChange={() => handleFilterChange("backend")}
            />
            <Label htmlFor="backend">Backend</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="devOps"
              checked={filters.devOps}
              onCheckedChange={() => handleFilterChange("devOps")}
            />
            <Label htmlFor="devOps">DevOps</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uiUx"
              checked={filters.uiUx}
              onCheckedChange={() => handleFilterChange("uiUx")}
            />
            <Label htmlFor="uiUx">UI/UX Design</Label>
          </div>

          {/* Salary Range */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Salary Range
            </h3>
            <div className="px-2">
              <Slider
                defaultValue={[minSalary, maxSalary]}
                max={300000}
                step={5000}
                onValueChange={(values) => {
                  setMinSalary(values[0]);
                  setMaxSalary(values[1]);
                }}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <div>${minSalary.toLocaleString()}</div>
                <div>${maxSalary.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Favorites Toggle */}
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="favorites"
              checked={showFavoritesOnly}
              onCheckedChange={toggleShowFavoritesOnly}
            />
            <Label htmlFor="favorites">Show Favorites Only</Label>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Sort By</h2>
        <Select
          value={sortBy}
          onValueChange={(value) => changeSortMethod(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Job Title (A-Z)</SelectItem>
            <SelectItem value="titleDesc">Job Title (Z-A)</SelectItem>
            <SelectItem value="salary">Salary (High to Low)</SelectItem>
            <SelectItem value="salaryDesc">Salary (Low to High)</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default JobFilters;
