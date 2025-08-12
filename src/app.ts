import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { setCloudinary } from "./startup/cloudinary";
import { setConfig } from "./startup/config";
import { connectDb } from "./startup/db";
import registerRoutes from "./startup/routes";

const app = express();

app.use(cookieParser());
app.use(cors());

connectDb();
setConfig();
setCloudinary();
registerRoutes(app);

const port: number = config.get("port") || 3000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export { server };


