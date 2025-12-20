import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthUserPayload extends JwtPayload {
  _id: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUserPayload;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUserPayload;
  }
}
