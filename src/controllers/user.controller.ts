import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { UserModel } from "../models/user/user.model";
import { UserDocument } from "../models/user/user.types";
import { validateUser } from "../RESTValidators/user.validator";

const SALT_ROUNDS = 12;

// TODO: rework with UserService
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = validateUser(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });

    return;
  }

  let user: UserDocument | null = await UserModel.findOne({
    email: req.body.email,
  });

  if (user) {
    res.status(400).json({ message: "User already registered" });

    return;
  }

  const { name, email, age, password } = req.body;

  user = new UserModel({
    name,
    email,
    age,
    password,
  });

  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    })
    .json({ _id: user._id, name: user.name, email: user.email, age: user.age });
};
