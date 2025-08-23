import { Request, Response } from "express";
import { EventModel } from "../models/event/event.model";
import { EventService } from "../services/event.service";

export const getEvents = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const events = await EventModel.find().select("-_id -publicId");

  res.status(200).json(events);
};

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const event = await EventService.createEvent(req.body, req.file);

  res.status(201).json(event);
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const { publicId, ...event } = await EventService.getEvent(req.params.slug);

  res.status(200).json(event);
};

export const updateEvent = async () => {
  // ...
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await EventService.deleteEvent(req.params.slug);

  if (result) {
    res.status(204).send();
  }
};
