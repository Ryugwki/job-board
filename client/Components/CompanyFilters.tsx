"use client";
import React from "react";
import { useCompanyContext } from "@/context/companyContext";
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

function CompanyFilters() {
  const {
    searchQuery,
    handleSearchChange,
    searchCompanies,
    filters,
    handleFilterChange,
    clearAllFilters,
    showFavoritesOnly,
    toggleShowFavoritesOnly,
    sortBy,
    changeSortMethod,
  } = useCompanyContext();

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          searchCompanies();
        }}
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search company name"
            value={searchQuery.name}
            onChange={(e) => handleSearchChange("name", e.target.value)}
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="topRated"
              checked={filters.topRated}
              onCheckedChange={() => handleFilterChange("topRated")}
            />
            <Label htmlFor="topRated">Top Rated</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newlyAdded"
              checked={filters.newlyAdded}
              onCheckedChange={() => handleFilterChange("newlyAdded")}
            />
            <Label htmlFor="newlyAdded">Newly Added</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smallCompanies"
              checked={filters.smallCompanies}
              onCheckedChange={() => handleFilterChange("smallCompanies")}
            />
            <Label htmlFor="smallCompanies">Small Companies</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mediumCompanies"
              checked={filters.mediumCompanies}
              onCheckedChange={() => handleFilterChange("mediumCompanies")}
            />
            <Label htmlFor="mediumCompanies">Medium Companies</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="largeCompanies"
              checked={filters.largeCompanies}
              onCheckedChange={() => handleFilterChange("largeCompanies")}
            />
            <Label htmlFor="largeCompanies">Large Companies</Label>
          </div>
          {/* Favorites Toggle */}
          <div className="flex items-center space-x-2">
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
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default CompanyFilters;
