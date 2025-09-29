import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service";

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });

    return;
  }

  try {
    req.user = AuthService.verifyToken(token);
    next();
  } catch (ex) {
    if (process.env.NODE_ENV !== "production") {
      console.error("JWT verification error:", ex);
    } else {
      console.error("JWT verification error occurred.");
    }

    res.status(400).json({ message: "Invalid token" });
  }
};

export { auth };
