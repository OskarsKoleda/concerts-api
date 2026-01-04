import { Response } from "express";
import {
  AuthenticatedRequest,
  MaybeAuthenticatedRequest,
} from "../middleware/auth.types";
import { EventService } from "../services/event.service";
import { VisitsService } from "../services/visits.service";

export const getEvent = async (
  req: MaybeAuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { user } = req;
  const { publicId, ...event } = await EventService.getEvent(
    req.params.slug,
    user?._id
  );

  res.status(200).json(event);
};

export const getEvents = async (
  req: MaybeAuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { user } = req;
  const events = await EventService.getEvents(req.query, user?._id);

  res.status(200).json(events);
};

export const postEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { body, user, file } = req;
  const event = await EventService.createEvent(body, user, file);

  res.status(201).json(event);
};

// TODO: anyone logged in can update any event
export const patchEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { body, params, user, file } = req;
  const result = await EventService.updateEvent(
    params.slug,
    body,
    user._id,
    file
  );

  if (result) {
    res.status(200).json(result);
  }
};

export const deleteEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const result = await EventService.deleteEvent(req.params.slug, req.user._id);

  if (result) {
    res.status(204).send();
  }
};

export const visitEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { params, user } = req;

  await VisitsService.addVisit(params.slug, user._id);

  res.status(204).send();
};

export const unvisitEvent = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { params, user } = req;

  await VisitsService.deleteVisit(params.slug, user._id);

  res.status(204).send();
};
