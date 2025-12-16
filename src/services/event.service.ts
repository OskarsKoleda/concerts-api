import slugify from "slugify";
import { AuthUserPayload } from "../middleware/auth.types";
import {
  CreateEventInput,
  EventDocument,
  EventRecord,
  EventResponse,
  UpdateEventInput,
} from "../models/event/event.types";
import { UserDocument } from "../models/user/user.types";
import { AppError } from "../utils/AppError";
import { normalizeEventInput } from "../utils/normalize";
import { destroyImage, uploadImage } from "./cloudinary/cloudinary.service";
import {
  addVisitInDb,
  createEventInDb,
  deleteEventFromDb,
  ensureUniqueTitle,
  getEventFromDb,
  getEventsFromDb,
  updateEventInDb,
} from "./db/eventDB.service";
import { EventQueryParams } from "./types";
import { UserService } from "./user.service";
import {
  validateEventCreateBody,
  validateEventUpdatedBody,
} from "./validation/eventValidation.service";

import _ from "lodash";

export class EventService {
  static async createEvent(
    event: CreateEventInput,
    userData: AuthUserPayload,
    file?: Express.Multer.File
  ): Promise<EventResponse> {
    normalizeEventInput(event);
    validateEventCreateBody(event);
    await ensureUniqueTitle(event.title);

    const { public_id, secure_url } = await uploadImage(file);
    const user: UserDocument = await UserService.getUser(userData._id);

    const eventRecord: EventRecord = {
      ...event,
      publicId: public_id,
      url: secure_url,
      ownerId: user._id.toString(),
    };

    const createdEvent = await createEventInDb(eventRecord);

    return {
      ..._.omit(createdEvent, "ownerId"),
      owner: { id: user._id, name: user.name },
    };
  }

  static async getEvent(slug: string): Promise<EventResponse> {
    const event = await getEventFromDb(slug);

    return event;
  }

  static async getEvents(params: EventQueryParams): Promise<EventResponse[]> {
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
  ): Promise<EventResponse> {
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

  static async visitEvent(slug: string, userData: AuthUserPayload) {
    // const event = await this.getEvent(slug);

    addVisitInDb(slug, userData._id);
  }
}
