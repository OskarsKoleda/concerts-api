import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";

import { config } from "../../startup/validateConfig";
import { UserDocument } from "./user.types";

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true, minLength: 2, maxLength: 50 },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  email: { type: String, required: true, minLength: 5, maxLength: 50 },
  password: { type: String, required: true, minLength: 6, maxLength: 1024 },
});

userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign({ _id: this.id, name: this.name }, config.jwtPrivateKey);
};

export const UserModel = model<UserDocument>("User", userSchema);
