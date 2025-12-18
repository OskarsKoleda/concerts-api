import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { app } from "./app";
import { setCloudinary } from "./startup/cloudinary";
import { connectDb } from "./startup/db";

const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectDb();
  setCloudinary();

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();
