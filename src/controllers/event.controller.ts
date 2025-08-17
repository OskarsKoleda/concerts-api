import { Request, Response } from "express";
import { EventModel } from "../models/event/event.model";
import { EventService } from "../services/event.service";

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const events = await EventModel.find();

  res.status(200).json(events);
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const event = await EventService.createEvent(req.body, req.file);

  res.status(201).json(event);
};

export const getEvent = async () => {
  // ...
};

export const updateEvent = async () => {
  // ...
};

export const deleteEvent = async () => {
  // ...
};
