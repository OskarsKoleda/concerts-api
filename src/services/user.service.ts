import { UserDocument, UserModelFields } from "../models/user/user.types";
import {
  createUserInDb,
  ensureUniqueEmail,
  getUserFromDb,
} from "./db/userDB.service";
import { validateUserCreateBody } from "./validation/userValidation.service";

export class UserService {
  static async registerUser(userData: UserModelFields): Promise<UserDocument> {
    validateUserCreateBody(userData);

    await ensureUniqueEmail(userData.email);

    const user = await createUserInDb(userData);

    return user;
  }

  static async getUser(userId: string): Promise<UserDocument> {
    const user = await getUserFromDb(userId);

    return user;
  }
}
