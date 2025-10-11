import { Request, Response } from "express";
import { EventService } from "../services/event.service";

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  const { publicId, ...event } = await EventService.getEvent(req.params.slug);

  res.status(200).json(event);
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const events = await EventService.getEvents(req.query);

  res.status(200).json(events);
};

export const postEvent = async (req: Request, res: Response): Promise<void> => {
  const { body, user, file } = req;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });

    return;
  }

  const event = await EventService.createEvent(body, user, file);

  res.status(201).json(event);
};

export const patchEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { body, params, user, file } = req;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });

    return;
  }

  const result = await EventService.updateEvent(params.slug, body, file);

  if (result) {
    res.status(200).json(result);
  }
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
