import slugify from "slugify";
import { EventModel } from "../../models/event/event.model";
import {
  EventDocument,
  EventRecord,
  EventResponse,
  PopulatedEventDocument,
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
  data: EventRecord
): Promise<EventDocument> => {
  const event = new EventModel(data);
  const savedEvent = await event.save();

  return savedEvent.toObject();
};

export const getEventsFromDb = async (
  params: EventQueryParams
): Promise<EventResponse[]> => {
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

  if (params.category) {
    eventFilter.category = params.category;
  }

  const events = await EventModel.find(eventFilter)
    .populate({
      path: "ownerId",
      select: "name _id",
    })
    .lean<PopulatedEventDocument[]>();

  return events.map(addOwnerToEvent);
};

export const getEventFromDb = async (slug: string): Promise<EventResponse> => {
  const event = await EventModel.findOne({
    slug,
  })
    .populate({
      path: "ownerId",
      select: "name _id",
    })
    .lean<PopulatedEventDocument>();

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return addOwnerToEvent(event);
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
  event: Partial<EventRecord>
): Promise<EventResponse> => {
  const updatedEvent = await EventModel.findOneAndUpdate(
    { slug: slug },
    { $set: event },
    { new: true }
  )
    .populate({
      path: "ownerId",
      select: "name _id",
    })
    .lean<PopulatedEventDocument>();

  if (!updatedEvent) {
    throw new AppError("Event not found", 404);
  }

  return addOwnerToEvent(updatedEvent);
};

const addOwnerToEvent = (event: PopulatedEventDocument): EventResponse => {
  const { ownerId, ...rest } = event;

  return {
    ...rest,
    owner: {
      id: ownerId._id,
      name: ownerId.name,
    },
  };
};
