import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { validateUserLogin } from "../models/auth.validation";
import { UserModel } from "../models/user/user.model";

export const authorizeUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = validateUserLogin(req.body);

  if (error) {
    res.status(400).json({ message: error.details[0].message });

    return;
  }

  let user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).json({ message: "Invalid email or password" });

    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    res.status(400).json({ message: "Invalid email or password" });

    return;
  }

  const token = user.generateAuthToken();

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    })
    .json({
      name: user.name,
      email: user.email,
      age: user.age,
    });
};
