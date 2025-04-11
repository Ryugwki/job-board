import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";
dotenv.config();

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL,
  },
};
//Config
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  if (req.headers["content-length"] > 10 * 1024 * 1024) {
    // Reject requests larger than 10MB
    return res.status(413).json({ message: "File size exceeds limit" });
  }
  next();
});
app.use(auth(config));

//Function to check if user exists
// Fix typo in function name: asyncHanlder → asyncHandler
const ensureUserInDB = asyncHandler(async (user) => {
  try {
    console.log("Checking if user exists in DB:", user.sub);
    const existingUser = await User.findOne({ auth0Id: user.sub });

    if (!existingUser) {
      console.log("Creating new user in database");
      // Fix role field to be an array as defined in your schema
      const newUser = new User({
        auth0Id: user.sub,
        name: user.name,
        email: user.email,
        role: ["job seeker"], // Change from string to array to match schema
        profilePicture: user.picture,
        isAdmin: false,
      });

      // Save and log any errors in detail
      try {
        await newUser.save();
        console.log("User successfully added to database:", newUser._id);
      } catch (saveError) {
        console.error("Database save error:", saveError);
        console.error("Validation errors:", saveError.errors);
        throw saveError; // Re-throw to propagate the error
      }
    } else {
      console.log("User already exists in database:", existingUser._id);
    }
  } catch (error) {
    console.error("Error in ensureUserInDB:", error.message);
    console.error("Full error:", error);
    throw error; // Propagate the error
  }
});

app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    try {
      //Check if auth0 user exists in database
      await ensureUserInDB(req.oidc.user);
      //Redirect to client home page
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      console.error("Error ensuring user in DB:", error);
      // Still redirect but log the error
      return res.redirect(process.env.CLIENT_URL);
    }
  } else {
    return res.send("Logged out");
  }
});

//Routes
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
  //Dynamic Routes
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1/", route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error);
    });
});

app.get("/", (req, res) => {});

const server = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

server();
