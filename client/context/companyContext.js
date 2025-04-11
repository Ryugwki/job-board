"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const CompanyContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const CompanyContextProvider = ({ children }) => {
  const { userProfile, getUserProfile } = useGlobalContext();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userCompanies, setUserCompanies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [searchQuery, setSearchQuery] = useState({
    name: "",
    location: "",
    industry: "",
  });
  const [filters, setFilters] = useState({
    topRated: false,
    newlyAdded: false,
    smallCompanies: false,
    mediumCompanies: false,
    largeCompanies: false,
  });

  // State for sorting
  const [sortBy, setSortBy] = useState("newest");

  // Toggle favorites only view
  const toggleShowFavoritesOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  // Change sort method
  const changeSortMethod = (method) => {
    setSortBy(method);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      topRated: false,
      newlyAdded: false,
      smallCompanies: false,
      mediumCompanies: false,
      largeCompanies: false,
    });
    setSearchQuery({ name: "", location: "" });
    setShowFavoritesOnly(false);
    setSortBy("newest");
  };

  // Fetch all companies
  const getCompanies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/companies");
      setCompanies(res.data);
      setFilteredCompanies(res.data);
    } catch (error) {
      console.log("Error getting companies", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new company
  const createCompany = async (companyData) => {
    try {
      const res = await axios.post("/api/v1/companies", companyData);

      toast.success("Company created successfully");

      setCompanies((prevCompanies) => [res.data, ...prevCompanies]);
      setFilteredCompanies((prevCompanies) => [res.data, ...prevCompanies]);

      // update userCompanies
      if (userProfile?._id) {
        setUserCompanies((prevUserCompanies) => [
          res.data,
          ...prevUserCompanies,
        ]);
        await getUserCompanies(userProfile._id);
      }

      await getCompanies();
      // redirect to the company details page
      router.push(`/company/${res.data._id}`);
    } catch (error) {
      console.error("Error creating company", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create company";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update a company
  const updateCompany = async (id, companyData) => {
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error("Company ID is required for updates");
      }

      console.log("Updating company with data:", companyData);

      const response = await axios.put(
        `/api/v1/companies/edit/${id}`,
        companyData
      );
      const updatedCompany = response.data;

      setCompanies((prev) =>
        prev.map((company) =>
          company._id === id ? { ...company, ...updatedCompany } : company
        )
      );

      setFilteredCompanies((prev) =>
        prev.map((company) =>
          company._id === id ? { ...company, ...updatedCompany } : company
        )
      );

      toast.success("Company updated successfully!");
      return updatedCompany;
    } catch (err) {
      console.error("Error updating company:", err);
      const errorDetails =
        err.response?.data?.message ||
        err.message ||
        "Failed to update company";
      setError(errorDetails);
      toast.error(errorDetails);
      throw err; // Re-throw to allow handling in components
    } finally {
      setLoading(false);
    }
  };

  // Delete a company
  const deleteCompany = async (id) => {
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error("Company ID is required for deletion");
      }

      console.log("Deleting company with ID:", id);
      await axios.delete(`/api/v1/companies/${id}`);

      setCompanies((prev) => prev.filter((company) => company._id !== id));
      setFilteredCompanies((prev) =>
        prev.filter((company) => company._id !== id)
      );

      // Also remove from favorites if present
      setFavorites((prev) => prev.filter((favId) => favId !== id));

      toast.success("Company deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting company:", err);
      const errorDetails =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete company";
      setError(errorDetails);
      toast.error(errorDetails);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get companies created by a specific user
  const getUserCompanies = async (userId) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/v1/companies/user/" + userId);
      setUserCompanies(res.data);
    } catch (error) {
      console.log("Error getting user companies", error);
    } finally {
      setLoading(false);
    }
  };

  // Get company by id
  const getCompanyById = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/companies/${id}`);
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Error getting company by id", error);
    } finally {
      setLoading(false);
    }
  };

  // Search companies function
  const searchCompanies = (name = "", location = "") => {
    setLoading(true);
    try {
      // If search params are provided, use them, otherwise use current searchQuery state
      const searchName = name !== undefined ? name : searchQuery.name;
      const searchLocation =
        location !== undefined ? location : searchQuery.location;

      // Update searchQuery state
      setSearchQuery({ name: searchName, location: searchLocation });

      // Apply filters and search
      applyFiltersAndSearch(searchName, searchLocation);
    } catch (err) {
      console.error("Error searching companies:", err);
      setError(err.message || "Failed to search companies");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (searchName, value) => {
    setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
  };

  // Handle filter change
  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  // Toggle company favorite status
  const toggleFavorite = (companyId) => {
    setFavorites((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  // Apply filters and search function
  const applyFiltersAndSearch = (
    name = searchQuery.name,
    location = searchQuery.location
  ) => {
    let results = [...companies];

    // Apply search by name
    if (name) {
      results = results.filter((company) =>
        company.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Apply search by location
    if (location) {
      results = results.filter((company) =>
        company.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply filters
    if (Object.values(filters).some((value) => value)) {
      const filteredResults = [];

      for (const company of results) {
        if (filters.topRated && company.rating >= 4) {
          filteredResults.push(company);
          continue;
        }

        if (filters.newlyAdded && isNewlyAdded(company.createdAt)) {
          filteredResults.push(company);
          continue;
        }

        if (filters.smallCompanies && company.size === "small") {
          filteredResults.push(company);
          continue;
        }

        if (filters.mediumCompanies && company.size === "medium") {
          filteredResults.push(company);
          continue;
        }

        if (filters.largeCompanies && company.size === "large") {
          filteredResults.push(company);
          continue;
        }
      }

      results = filteredResults;
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      results = results.filter((company) => favorites.includes(company._id));
    }

    // Apply sorting
    results = sortCompanies(results, sortBy);

    // Update filtered companies
    setFilteredCompanies(results);
  };

  // Helper function to check if a company was added recently (e.g., within the last 30 days)
  const isNewlyAdded = (createdAt) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
  };

  // Helper function to sort companies
  const sortCompanies = (companiesToSort, sortMethod) => {
    switch (sortMethod) {
      case "name":
        return [...companiesToSort].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      case "nameDesc":
        return [...companiesToSort].sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      case "rating":
        return [...companiesToSort].sort((a, b) => b.rating - a.rating);
      case "newest":
        return [...companiesToSort].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return [...companiesToSort].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return companiesToSort;
    }
  };

  // Effect to apply filters when companies, filters, search query, or sort method changes
  useEffect(() => {
    if (companies.length > 0) {
      applyFiltersAndSearch();
    }
  }, [companies, filters, sortBy, showFavoritesOnly]);

  // Load companies when the component mounts
  useEffect(() => {
    getCompanies();

    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem("favoriteCompanies");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favoriteCompanies", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        filteredCompanies,
        loading,
        error,
        getCompanies,
        createCompany,
        updateCompany,
        deleteCompany,
        searchCompanies,
        handleSearchChange,
        searchQuery,
        handleFilterChange,
        filters,
        favorites,
        toggleFavorite,
        showFavoritesOnly,
        toggleShowFavoritesOnly,
        sortBy,
        changeSortMethod,
        clearAllFilters,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook to use the CompanyContext
export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
};
