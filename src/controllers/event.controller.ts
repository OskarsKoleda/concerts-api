import { Request, Response } from "express";
import { EventModel } from "../models/event/event.model";
import { validateEvent } from "../models/event/event.validation";
import { AppError } from "../utils/AppError";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = validateEvent(req.body);

  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  let event = await EventModel.findOne({
    title: { $regex: req.body.title, $options: "i" },
  });

  if (event) {
    throw new AppError("Title already exists", 409);
  }

  event = new EventModel(req.body);

  await event.save();

  res.status(201).json(event);
};
