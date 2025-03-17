import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHanlder from "express-async-handler";
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
};
//Config
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth(config));

//Function to check if user exists
const ensureUserInDB = asyncHanlder(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });
    if (!existingUser) {
      const newUser = new User({
        auth0Id: user.sub,
        name: user.name,
        email: user.email,
        role: "jobseeker",
        profilePicture: user.picture,
      });
      await newUser.save();
      console.log("User added to database", user);
    } else {
      console.log("User already exists in database", existingUser);
    }
  } catch (error) {
    console.log("Error checking or adding user", error.message);
  }
});

app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    //Check if auth0 user exists in database
    await ensureUserInDB(req.oidc.user);
    //Redirect to client home page
    return res.redirect(process.env.CLIENT_URL);
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
