import { UserLoginFields } from "../../models/user/user.types";
import { validateUserLogin } from "../../RESTValidators/auth.validator";
import { AppError } from "../../utils/AppError";

export const validateUserCredentials = (credentials: UserLoginFields) => {
  const { error } = validateUserLogin(credentials);

  if (error) {
    throw new AppError(error.details[0].message || "Invalid login data", 400);
  }
};
