import cookieParser from "cookie-parser";
import express from "express";

import { configureCors } from "./middleware/cors.middleware";
import registerRoutes from "./startup/routes";

const app = express();

app.use(cookieParser());
app.use(configureCors());

registerRoutes(app);

export { app };
