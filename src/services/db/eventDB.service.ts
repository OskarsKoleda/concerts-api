import slugify from "slugify";
import { EventModel } from "../../models/event/event.model";
import {
  EventModelFields,
  EventRecordFields,
} from "../../models/event/event.types";
import { AppError } from "../../utils/AppError";

export const ensureUniqueTitle = async (title: string): Promise<void> => {
  const slug = slugify(title, { lower: true, strict: true });

  const existingEvent = await EventModel.findOne({ slug });

  if (existingEvent) {
    throw new AppError("Event with this title already exists", 409);
  }
};

export const createEventRecord = async (
  data: EventRecordFields
): Promise<EventModelFields> => {
  const event = new EventModel(data);

  await event.save();

  return event;
};

export const getEvent = async (slug: string): Promise<EventRecordFields> => {
  const event = await EventModel.findOne({ slug }).select("-_id");

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return event;
};

export const deleteEvent = async (slug: string): Promise<boolean> => {
  const event = await EventModel.findOne({ slug });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const deletedEvent = await event.deleteOne();

  return deletedEvent.acknowledged;
};

// export const updateEvent = async (
//   slug: string,
//   event: Partial<EventCreationFields>
// ) => {
//   const event = EventModel.findOneAndUpdate({ slug: slug }, { $set: event });
// };
