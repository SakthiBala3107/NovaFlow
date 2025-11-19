import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV?.DB_URL, {});
    console.log("Database is connected");
  } catch (error) {
    console.error("Error connecting Database", error);
    process.exit(1);
  }
};
