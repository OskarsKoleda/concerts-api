import {
  EventCreationFields,
  EventModelFields,
  EventRecordFields,
} from "../models/event/event.types";
import { AppError } from "../utils/AppError";
import { normalizeEventInput } from "../utils/normalize";
import { destroyImage, uploadImage } from "./cloudinary/cloudinary.service";
import {
  createEventRecord,
  deleteEvent,
  ensureUniqueTitle,
  getEvent,
} from "./db/eventDB.service";
import { validateEventRules } from "./validation/eventValidation.service";

import _ from "lodash";

export class EventService {
  static async createEvent(
    event: EventCreationFields,
    file?: Express.Multer.File
  ): Promise<EventModelFields> {
    normalizeEventInput(event);

    validateEventRules(event);

    await ensureUniqueTitle(event.title);

    const { public_id, secure_url } = await uploadImage(file);

    const cleanEvent = _.omitBy(
      {
        ...event,
        publicId: public_id,
        url: secure_url,
      },
      _.isNil
    ) as EventRecordFields;

    return createEventRecord(cleanEvent);
  }

  static async getEvent(slug: string): Promise<EventRecordFields> {
    return await getEvent(slug);
  }

  static async deleteEvent(slug: string): Promise<boolean> {
    const event = await getEvent(slug);
    const posterPublicId: string | undefined = event.publicId;

    const deleteEventResult = await deleteEvent(slug);

    if (!deleteEventResult) {
      throw new AppError("Could not delete the event", 500);
    }

    if (posterPublicId) {
      await destroyImage(posterPublicId);
    }

    return true;
  }

  // static async updatedEvent(slug: string) {

  // }
}
