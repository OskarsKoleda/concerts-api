import bcrypt from "bcrypt";
import { UserModel } from "../../models/user/user.model";
import { UserDocument, UserModelFields } from "../../models/user/user.types";
import { AppError } from "../../utils/AppError";
import { SALT_ROUNDS } from "./constants";

export const ensureUniqueEmail = async (email: string): Promise<void> => {
  const user: UserDocument | null = await UserModel.findOne({ email });

  if (user) {
    throw new AppError("User with this email already exists", 409);
  }
};

export const createUserInDb = async (
  userData: UserModelFields
): Promise<UserDocument> => {
  const user = new UserModel(userData);

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  return user;
};

export const getUserFromDb = async (userId: string): Promise<UserDocument> => {
  const user = await UserModel.findById(userId).select("-password -__v").lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};
