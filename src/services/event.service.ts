import slugify from "slugify";
import { AuthUserPayload } from "../middleware/auth.types";
import {
  CreateEventInput,
  EventDocument,
  EventRecord,
  PopulatedEventDocument,
  UpdateEventInput,
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

export class EventService {
  static async createEvent(
    event: CreateEventInput,
    userData: AuthUserPayload,
    file?: Express.Multer.File
  ): Promise<PopulatedEventDocument> {
    normalizeEventInput(event);
    validateEventCreateBody(event);
    await ensureUniqueTitle(event.title);

    const { public_id, secure_url } = await uploadImage(file);

    const eventRecord: EventRecord = {
      ...event,
      publicId: public_id,
      url: secure_url,
      owner: userData._id,
    };

    const createdEvent = await createEventInDb(eventRecord);

    return createdEvent;
  }

  static async getEvent(slug: string): Promise<PopulatedEventDocument> {
    const event = await getEventFromDb(slug);

    return event;
  }

  static async getEvents(
    params: EventQueryParams
  ): Promise<PopulatedEventDocument[]> {
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
    event: UpdateEventInput,
    file?: Express.Multer.File
  ): Promise<PopulatedEventDocument> {
    normalizeEventInput(event);
    validateEventUpdatedBody(event);

    let fieldsToUpdate: Partial<EventDocument> = { ...event };

    if (event.title) {
      await ensureUniqueTitle(event.title);
      fieldsToUpdate.slug = slugify(event.title, { lower: true, strict: true });
    }

    if (file) {
      const currentEvent = await this.getEvent(slug);
      const posterPublicId: string | undefined = currentEvent.publicId;

      if (posterPublicId) {
        await destroyImage(posterPublicId);
      }

      const { public_id, secure_url } = await uploadImage(file);

      fieldsToUpdate.publicId = public_id;
      fieldsToUpdate.url = secure_url;
    }

    return await updateEventInDb(slug, fieldsToUpdate);
  }
}
