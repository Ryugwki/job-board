import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const GlobalContext = createContext();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const GlobalContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auth0User, setAuth0User] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);

  //jobs input state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [salary, setSalary] = useState(0);
  const [activeEmploymentTypes, setActiveEmploymentTypes] = useState([]);
  const [salaryType, setSalaryType] = useState("Year");
  const [negotiable, setNegotiable] = useState(false);
  const [tags, setTags] = useState([]);
  const [skills, setSkills] = useState([]);

  // Company related states
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [employees, setEmployees] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [marketPosition, setMarketPosition] = useState("");
  const [marketFocus, setMarketFocus] = useState("");
  const [location, setLocation] = useState({
    country: "",
    city: "",
    address: "",
  });

  // Clear all company form states
  const resetCompanyForm = () => {
    setCompanyName("");
    setCompanyDescription("");
    setWebsite("");
    setLogo("");
    setCompanySize("");
    setIndustry("");
    setEmployees("");
    setTechnologies([]);
    setMarketPosition("");
    setMarketFocus("");
    setLocation({
      country: "",
      city: "",
      address: "",
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/check-auth");
        setIsAuthenticated(res.data.isAuthenticated);
        setAuth0User(res.data.user);
        setLoading(false);
      } catch (error) {
        console.log("Error checking auth", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const getUserProfile = async (id) => {
    try {
      const res = await axios.get(`/api/v1/user/${id}`);

      setUserProfile(res.data);
    } catch (error) {
      console.log("Error getting user profile", error);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const userId = userProfile?._id; // Ensure `_id` is used from userProfile
      if (!userId) {
        throw new Error("User ID is not available");
      }

      console.log("Updating profile for userId:", userId); // Debugging log

      const res = await axios.put(`/api/v1/user/${userId}`, profileData); // Correct API endpoint

      setUserProfile(res.data);
      console.log("Profile updated successfully:", res.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // handle input change
  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value.trimStart());
  };

  const handleDescriptionChange = (e) => {
    setJobDescription(e.target.value.trimStart());
  };

  const handleSalaryChange = (e) => {
    setSalary(e.target.value);
  };

  const resetJobForm = () => {
    setJobTitle("");
    setJobDescription("");
    setSalary(0);
    setActiveEmploymentTypes([]);
    setSalaryType("Year");
    setNegotiable(false);
    setTags([]);
    setSkills([]);
    setLocation({
      country: "",
      city: "",
      address: "",
    });
  };

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      getUserProfile(auth0User.sub);
    }
  }, [isAuthenticated, auth0User]);

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        auth0User,
        userProfile,
        getUserProfile,
        loading,
        jobTitle,
        jobDescription,
        salary,
        activeEmploymentTypes,
        salaryType,
        negotiable,
        tags,
        skills,
        location,
        handleJobTitleChange,
        handleDescriptionChange,
        handleSalaryChange,
        setActiveEmploymentTypes,
        setJobDescription,
        setSalaryType,
        setNegotiable,
        setTags,
        setSkills,
        setLocation,
        resetJobForm,
        updateUserProfile,

        // Company related states
        companyName,
        setCompanyName,
        companyDescription,
        setCompanyDescription,
        website,
        setWebsite,
        logo,
        setLogo,
        companySize,
        setCompanySize,
        industry,
        setIndustry,
        employees,
        setEmployees,
        technologies,
        setTechnologies,
        marketPosition,
        setMarketPosition,
        marketFocus,
        setMarketFocus,
        location,
        setLocation,
        resetCompanyForm,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
