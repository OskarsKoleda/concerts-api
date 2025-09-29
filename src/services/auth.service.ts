import jwt from "jsonwebtoken";
import { AuthUserPayload } from "../middleware/auth.types";
import { UserDocument, UserLoginFields } from "../models/user/user.types";
import { AppError } from "../utils/AppError";
import { ensurePasswordIsValid, ensureUserExists } from "./db/authDB.service";
import { validateUserCredentials } from "./validation/authValidation.service";

export class AuthService {
  static async login(userCredentials: UserLoginFields): Promise<UserDocument> {
    validateUserCredentials(userCredentials);

    const user = await ensureUserExists(userCredentials.email);

    await ensurePasswordIsValid(user.password, userCredentials.password);

    return user;
  }

  static verifyToken(token: string): AuthUserPayload {
    const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

    if (!jwtPrivateKey) {
      throw new AppError("Authentication configuration error");
    }

    try {
      const decoded = jwt.verify(token, jwtPrivateKey);

      return decoded as AuthUserPayload;
    } catch (err) {
      throw new AppError("Invalid token payload", 400);
    }
  }
}
