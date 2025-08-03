import config from "config";
import mongoose from "mongoose";

export const connectDb = async (): Promise<void> => {
  const db: string = config.get("db");

  if (!db) {
    console.error("Fatal error: DB not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(db);
    console.log("Successfully connected to the database.");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
};
