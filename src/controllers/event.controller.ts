import { Request, Response } from "express";
import { EventModel } from "../models/event/event.model";
import { validateEvent } from "../models/event/event.validation";
import { AppError } from "../utils/AppError";
import { uploadImage } from "./cloudinary.controller";

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const events = await EventModel.find();

  res.status(200).json(events);
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (typeof req.body.bands === "string") {
    req.body.bands = req.body.bands.split(",");
  }

  const { error } = validateEvent(req.body);

  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const existingEvent = await EventModel.findOne({
    title: { $regex: req.body.title, $options: "i" },
  });

  if (existingEvent) {
    throw new AppError("Title already exists", 409);
  }

  if (!req.file) {
    throw new AppError("Image not provided", 400);
  }

  const { public_id, secure_url } = await uploadImage(req.file.buffer);

  req.body.publicId = public_id;
  req.body.url = secure_url;

  const event = new EventModel(req.body);

  await event.save();

  res.status(201).json(event);
};
