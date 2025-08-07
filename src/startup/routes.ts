import express, { Application } from "express";

import { errorHandler } from "../middleware/error.middleware";
import auth from "../routes/auth.routes";
import events from "../routes/events.routes";
import user from "../routes/users.routes";

export default function registerRoutes(app: Application): void {
  app.use(express.json());
  app.use("/user", user);
  app.use("/events", events);
  app.use("/auth", auth);
  app.use(errorHandler);
}
