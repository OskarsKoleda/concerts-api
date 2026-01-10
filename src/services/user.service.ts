import {
  UserDocument,
  UserModelFields,
  UserStats,
} from "../models/user/user.types";
import {
  createUserInDb,
  ensureUniqueEmail,
  getUserFromDb,
  getUserStatsFromDb,
} from "./db/userDB.service";
import { validateUserCreateBody } from "./validation/userValidation.service";

export class UserService {
  static async registerUser(userData: UserModelFields): Promise<UserDocument> {
    validateUserCreateBody(userData);

    await ensureUniqueEmail(userData.email);

    return createUserInDb(userData);
  }

  static async getUser(userId: string): Promise<UserDocument> {
    return getUserFromDb(userId);
  }

  static async getUserStats(userId: string): Promise<UserStats> {
    return getUserStatsFromDb(userId);
  }
}
