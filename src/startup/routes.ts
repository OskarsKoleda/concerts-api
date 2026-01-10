import express, { Application } from "express";

import { errorHandler } from "../middleware/error.middleware";
import auth from "../routes/auth.routes";
import events from "../routes/events.routes";
import user from "../routes/users.routes";

export default function registerRoutes(app: Application): void {
  app.use(express.json()); // Parses incoming requests with JSON payloads and populates req.body
  app.use("/users", user);
  app.use("/events", events);
  app.use("/auth", auth);
  app.use(errorHandler);
}
