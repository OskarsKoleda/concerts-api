import { Request, Response } from "express";

import { UserService } from "../services/user.service";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userData = req.body;
  const user = await UserService.registerUser(userData);
  const token = user.generateAuthToken();

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    })
    .json({ id: user._id, name: user.name, email: user.email, age: user.age });
};
