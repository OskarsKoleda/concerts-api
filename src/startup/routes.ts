import express, { Application } from "express";

import auth from "../routes/auth.routes";
import user from "../routes/users";

export default function registerRoutes(app: Application): void {
  app.use(express.json());
  app.use("/user", user);
  app.use("/auth", auth);
}
