import { AppError } from "../utils/AppError";

interface Config {
  jwtPrivateKey: string;
  nodeEnv: string;
  mongoUri: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  port: number;
}

export const config: Config = {
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
  nodeEnv: process.env.NODE_ENV as string,
  mongoUri: process.env.MONGO_URI as string,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
  port: Number(process.env.PORT) || 3000,
};

export function validateConfig() {
  const requiredVars = [
    "JWT_PRIVATE_KEY",
    "NODE_ENV",
    "MONGO_URI",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "PORT",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new AppError(
      `Missing required environment variables: ${missing.join(", ")}`,
      500,
      false
    );
  }
}
