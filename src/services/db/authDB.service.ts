import bcrypt from "bcrypt";
import { UserModel } from "../../models/user/user.model";
import { UserDocument, UserLoginFields } from "../../models/user/user.types";
import { AppError } from "../../utils/AppError";

export const ensureUserExists = async (
  email: UserLoginFields["email"]
): Promise<UserDocument> => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }

  return user;
};

export const ensurePasswordIsValid = async (
  providedPassword: string,
  storedPassword: string
): Promise<void> => {
  const validPassword = await bcrypt.compare(providedPassword, storedPassword);

  if (!validPassword) {
    throw new AppError("Invalid email or password", 400);
  }
};
