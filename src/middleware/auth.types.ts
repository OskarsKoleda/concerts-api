import { JwtPayload } from "jsonwebtoken";

export interface AuthUserPayload extends JwtPayload {
  _id: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUserPayload;
  }
}
