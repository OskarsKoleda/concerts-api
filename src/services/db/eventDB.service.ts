import slugify from "slugify";
import { EventModel } from "../../models/event/event.model";
import {
  EventCreationFields,
  EventModelFields,
  EventRecordFields,
} from "../../models/event/event.types";
import { AppError } from "../../utils/AppError";
import { EventQueryParams } from "../types";

export const ensureUniqueTitle = async (title: string): Promise<void> => {
  const slug = slugify(title, { lower: true, strict: true });

  const existingEvent = await EventModel.findOne({ slug });

  if (existingEvent) {
    throw new AppError("Event with this title already exists", 409);
  }
};

export const createEventInDb = async (
  data: EventRecordFields
): Promise<EventModelFields> => {
  const event = new EventModel(data);

  await event.save();

  return event;
};

export const getEventsFromDb = async (
  params: EventQueryParams
): Promise<EventRecordFields[]> => {
  const eventFilter: Record<string, any> = {};

  if (params.title) {
    eventFilter.title = { $regex: params.title, $options: "i" };
  }

  if (params.city) {
    eventFilter.city = { $regex: params.city, $options: "i" };
  }

  if (params.bands) {
    eventFilter.bands = { $in: params.bands.split(",") };
  }

  const events = await EventModel.find(eventFilter)
    .select("-_id -publicId")
    .lean();

  return events;
};

export const getEventFromDb = async (
  slug: string
): Promise<EventRecordFields> => {
  const event = await EventModel.findOne({ slug }).select("-_id").lean();

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return event;
};

export const deleteEventFromDb = async (slug: string): Promise<boolean> => {
  const event = await EventModel.findOne({ slug });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const deletedEvent = await event.deleteOne();

  return deletedEvent.acknowledged;
};

export const updateEventInDb = async (
  slug: string,
  event: Partial<EventCreationFields>
): Promise<EventModelFields> => {
  const updatedEvent = await EventModel.findOneAndUpdate(
    { slug: slug },
    { $set: event },
    { new: true }
  )
    .select("-_id")
    .lean();

  if (!updatedEvent) {
    throw new AppError("Event not found", 404);
  }

  return updatedEvent;
};
