import Joi, { ValidationResult } from "joi";
import { UserLoginFields } from "../models/user/user.types";

const validateUserLogin = (user: UserLoginFields): ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.min": "Email must be at least 5 characters",
      "string.max": "Email must be at most 50 characters",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(1024).required().messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be at most 1024 characters",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(user);
};

export { validateUserLogin };
