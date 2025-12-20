import mongoose from "mongoose";
import { config } from "./validateConfig";

export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Successfully connected to the database.");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
};
