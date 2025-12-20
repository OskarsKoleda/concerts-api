import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = `.env.${NODE_ENV}`;
const envPath = path.resolve(process.cwd(), envFile);

if (!fs.existsSync(envPath)) {
  throw new Error(`Missing env file: ${envFile}`);
}

dotenv.config({ path: envPath });
