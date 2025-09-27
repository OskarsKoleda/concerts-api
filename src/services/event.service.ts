import {
  EventCreationFields,
  EventModelFields,
  EventRecordFields,
} from "../models/event/event.types";
import { AppError } from "../utils/AppError";
import { normalizeEventInput } from "../utils/normalize";
import { destroyImage, uploadImage } from "./cloudinary/cloudinary.service";
import {
  createEventInDb,
  deleteEventFromDb,
  ensureUniqueTitle,
  getEventFromDb,
  getEventsFromDb,
  updateEventInDb,
} from "./db/eventDB.service";
import { EventQueryParams } from "./types";
import {
  validateEventCreateBody,
  validateEventUpdatedBody,
} from "./validation/eventValidation.service";

import _ from "lodash";

export class EventService {
  static async createEvent(
    event: EventCreationFields,
    file?: Express.Multer.File
  ): Promise<EventModelFields> {
    normalizeEventInput(event);

    validateEventCreateBody(event);

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

    return await createEventInDb(cleanEvent);
  }

  static async getEvent(slug: string): Promise<EventRecordFields> {
    return await getEventFromDb(slug);
  }

  static async getEvents(
    params: EventQueryParams
  ): Promise<EventRecordFields[]> {
    return await getEventsFromDb(params);
  }

  static async deleteEvent(slug: string): Promise<boolean> {
    const event = await this.getEvent(slug);
    const posterPublicId: string | undefined = event.publicId;

    const deleteEventResult = await deleteEventFromDb(slug);

    if (!deleteEventResult) {
      throw new AppError("Could not delete the event", 500);
    }

    if (posterPublicId) {
      await destroyImage(posterPublicId);
    }

    return true;
  }

  static async updateEvent(
    slug: string,
    event: Partial<EventCreationFields>,
    file?: Express.Multer.File
  ): Promise<EventRecordFields> {
    normalizeEventInput(event);

    validateEventUpdatedBody(event);

    if (event.title) {
      await ensureUniqueTitle(event.title);
    }

    let fieldsToUpdate: Partial<EventModelFields> = { ...event };

    if (file) {
      const currentEvent = await this.getEvent(slug);
      const posterPublicId: string | undefined = currentEvent.publicId;

      if (posterPublicId) {
        await destroyImage(posterPublicId);
      }

      const { public_id, secure_url } = await uploadImage(file);

      fieldsToUpdate["publicId"] = public_id;
      fieldsToUpdate["url"] = secure_url;
    }

    return await updateEventInDb(slug, fieldsToUpdate);
  }
}
