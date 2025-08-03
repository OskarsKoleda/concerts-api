import config from "config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { AuthUserPayload } from "./auth.types";

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });

    return;
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    if (typeof decoded === "object" && decoded !== null && "_id" in decoded) {
      req.user = decoded as AuthUserPayload;
      next();
    } else {
      res.status(400).json({ message: "Invalid token payload" });
    }
  } catch (ex) {
    // TODO: change when logging library added
    if (process.env.NODE_ENV !== "production") {
      console.error("JWT verification error:", ex);
    } else {
      console.error("JWT verification error occurred.");
    }
    res.status(400).json({ message: "Invalid token" });
  }
};

export { auth };
