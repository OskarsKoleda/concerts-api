import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { AuthUserPayload } from "./auth.types";

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
    }

    res.status(401).json({ message: "Invalid token" });
  }
};

const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  req.user = getAuthenticatedUser(req);
  next();
};

const getAuthenticatedUser = (req: Request): AuthUserPayload | undefined => {
  const token: string | undefined = req.cookies.token;

  if (!token) {
    return undefined;
  }

  try {
    return AuthService.verifyToken(token);
  } catch (ex) {
    if (process.env.NODE_ENV !== "production") {
      console.error("JWT verification error:", ex);
    }

    return undefined;
  }
};

export { auth, optionalAuth };
