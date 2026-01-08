import { Types } from "mongoose";
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
import { destroyImage, uploadImage } from "./cloudinary/cloudinary.service";
import {
  createEventInDb,
  deleteEventFromDb,
  ensureUniqueTitle,
  getEventFromDb,
  getEventsFromDb,
  updateEventInDb,
} from "./db/eventDB.service";
import { deleteAllEventVisitsInDb } from "./db/visitsDB.service";
import { EventQueryParams } from "./types";
import {
  validateEventCreateBody,
  validateEventUpdatedBody,
} from "./validation/eventValidation.service";
import { VisitsService } from "./visits.service";

export class EventService {
  static async createEvent(
    event: CreateEventInput,
    userData: AuthUserPayload,
    file?: Express.Multer.File
  ): Promise<PopulatedEventDocument> {
    const validatedEvent = validateEventCreateBody(event);
    await ensureUniqueTitle(validatedEvent.title);

    const { public_id, secure_url } = await uploadImage(file);
    const eventRecord: EventRecord = {
      ...validatedEvent,
      publicId: public_id,
      url: secure_url,
      owner: new Types.ObjectId(userData._id),
    };

    const createdEvent = await createEventInDb(eventRecord);

    return createdEvent;
  }

  static async getEvent(
    slug: string,
    userId?: string
  ): Promise<PopulatedEventDocument> {
    const event = await getEventFromDb(slug);

    if (userId) {
      const isVisited = await VisitsService.isVisited(event._id, userId);
      event.isVisited = isVisited;
    }

    return event;
  }

  static async getEvents(
    params: EventQueryParams,
    userId?: string
  ): Promise<PopulatedEventDocument[]> {
    const events = await getEventsFromDb(params);

    if (userId) {
      for (let i = 0; i < events.length; i++) {
        const isVisited = await VisitsService.isVisited(events[i]._id, userId);
        events[i].isVisited = isVisited;
      }
    }

    return events;
  }

  static async deleteEvent(slug: string, userId: string): Promise<boolean> {
    const deleteEventResult = await deleteEventFromDb(slug, userId);

    if (!deleteEventResult) {
      throw new AppError("Event not found or unauthorized", 404);
    }

    await deleteAllEventVisitsInDb(deleteEventResult._id);

    if (deleteEventResult.publicId) {
      await destroyImage(deleteEventResult.publicId);
    }

    return true;
  }

  static async updateEvent(
    slug: string,
    event: UpdateEventInput,
    userId: string,
    file?: Express.Multer.File
  ): Promise<PopulatedEventDocument> {
    const currentEvent = await this.getEvent(slug);

    if (currentEvent.owner._id.toString() !== userId) {
      throw new AppError("Event not found or unauthorized", 404);
    }

    validateEventUpdatedBody(event);

    let fieldsToUpdate: Partial<EventDocument> = {
      ...(event as unknown as Partial<EventDocument>),
    };

    if (event.title) {
      await ensureUniqueTitle(event.title);
      fieldsToUpdate.slug = slugify(event.title, {
        lower: true,
        strict: true,
      });
    }

    if (file) {
      if (currentEvent.publicId) {
        await destroyImage(currentEvent.publicId);
      }

      const { public_id, secure_url } = await uploadImage(file);

      fieldsToUpdate.publicId = public_id;
      fieldsToUpdate.url = secure_url;
    }

    return await updateEventInDb(
      currentEvent._id.toString(),
      userId,
      fieldsToUpdate
    );
  }
}
