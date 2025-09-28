import { UserDocument, UserLoginFields } from "../models/user/user.types";
import { ensurePasswordIsValid, ensureUserExists } from "./db/authDB.service";
import { validateUserCredentials } from "./validation/authValidation.service";

export class AuthService {
  static async login(userCredentials: UserLoginFields): Promise<UserDocument> {
    validateUserCredentials(userCredentials);

    const user = await ensureUserExists(userCredentials.email);

    await ensurePasswordIsValid(user.password, userCredentials.password);

    return user;
  }
}
