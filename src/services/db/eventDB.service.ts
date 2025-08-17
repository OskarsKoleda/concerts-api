import { EventModel } from "../../models/event/event.model";
import {
  EventModelFields,
  EventRecordFields,
} from "../../models/event/event.types";
import { AppError } from "../../utils/AppError";

export const ensureUniqueTitle = async (title: string): Promise<void> => {
  const existingEvent = await EventModel.findOne({
    title: { $regex: title, $options: "i" },
  });

  if (existingEvent) {
    throw new AppError("Title already exists", 409);
  }
};

export const createEventRecord = async (
  data: EventRecordFields
): Promise<EventModelFields> => {
  const event = new EventModel(data);

  await event.save();

  return event;
};
