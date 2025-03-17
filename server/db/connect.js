import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");
  } catch (error) {
    console.log("Failed to connect database", error.message);
    process.exit(1);
  }
};
export default connect;
