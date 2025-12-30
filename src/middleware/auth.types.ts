import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthUserPayload extends JwtPayload {
  _id: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUserPayload;
}

export interface MaybeAuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUserPayload;
  }
}
