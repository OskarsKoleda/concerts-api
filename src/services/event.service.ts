import {
  EventCreationFields,
  EventModelFields,
} from "../models/event/event.types";
import { normalizeEventInput } from "../utils/normalize";
import { uploadImage } from "./cloudinary/cloudinary.service";
import { createEventRecord, ensureUniqueTitle } from "./db/eventDB.service";
import { validateEventRules } from "./validation/eventValidation.service";

export class EventService {
  static async createEvent(
    event: EventCreationFields,
    file?: Express.Multer.File
  ): Promise<EventModelFields> {
    normalizeEventInput(event);

    validateEventRules(event);

    await ensureUniqueTitle(event.title);

    const { public_id, secure_url } = await uploadImage(file);

    return createEventRecord({
      ...event,
      publicId: public_id,
      url: secure_url,
    });
  }
}
