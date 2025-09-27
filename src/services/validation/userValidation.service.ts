import { UserModelFields } from "../../models/user/user.types";
import { validateUser } from "../../RESTValidators/user.validator";
import { AppError } from "../../utils/AppError";

export const validateUserCreateBody = (user: UserModelFields) => {
  const { error } = validateUser(user);

  if (error) {
    throw new AppError(error.details[0].message || "Invalid user data", 400);
  }
};
