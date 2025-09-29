import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";

export const authenticateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userCredentials = req.body;
  const user = await AuthService.login(userCredentials);
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
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
    });
};

export const logoutUser = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
