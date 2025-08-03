import Joi, { ValidationResult } from "joi";

import { UserLoginFields } from "./user.types";

const validateUserLogin = (user: UserLoginFields): ValidationResult => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
};

export { validateUserLogin };

