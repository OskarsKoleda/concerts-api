import "./bootstrap";

import { app } from "./app";
import { setCloudinary } from "./startup/cloudinary";
import { connectDb } from "./startup/db";
import { config, validateConfig } from "./startup/validateConfig";

validateConfig();

const startServer = async () => {
  await connectDb();
  setCloudinary();

  app.listen(config.port, () =>
    console.log(`Listening on port ${config.port}`)
  );
};

startServer();
