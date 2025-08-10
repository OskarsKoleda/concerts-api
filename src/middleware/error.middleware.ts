import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });

    return;
  }

  if (err instanceof MongooseError.ValidationError) {
    console.log("MongooseError.ValidationError");

    res.status(400).json({ message: Object.values(err.errors)[0].message });

    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }

  res.status(500).send("Internal server error");
};
