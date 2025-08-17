import Joi, { ValidationResult } from "joi";
import { UserModelFields } from "../models/user/user.types";

export const validateUser = (user: UserModelFields): ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    age: Joi.number().integer().min(1).max(120).required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
};
