import Joi, { ValidationResult } from "joi";
import { UserModelFields } from "../models/user/user.types";

export const validateUser = (user: UserModelFields): ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.base": "Name must be a string",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 50 characters",
      "string.empty": "Name cannot be empty", // TODO: test
      "any.required": "Name is required",
    }),
    email: Joi.string().min(5).max(50).required().email().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.min": "Email must be at least 5 characters",
      "string.max": "Email must be at most 50 characters",
      "string.empty": "Email cannot be empty", // TODO: test
      "any.required": "Email is required",
    }),
    age: Joi.number().integer().min(1).max(120).required().messages({
      "number.base": "Age must be a number",
      "number.integer": "Age must be an integer",
      "number.min": "Age must be at least 1",
      "number.max": "Age must be at most 120",
      "any.required": "Age is required",
    }),
    password: Joi.string().min(6).max(1024).required().messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be at most 1024 characters",
      "string.empty": "Password cannot be empty", // TODO: test
      "any.required": "Password is required",
    }),
    repeatPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Repeat password is required",
      }),
  });

  return schema.validate(user);
};
