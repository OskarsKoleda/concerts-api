import { Types } from "mongoose";
import { VisitsDocument } from "../models/visits/visits.types";
import { AppError } from "../utils/AppError";
import { getEventFromDb } from "./db/eventDB.service";
import {
  addVisitInDb,
  deleteVisitInDb,
  getVisitInDb,
} from "./db/visitsDB.service";

export class VisitsService {
  static async addVisit(slug: string, userId: string): Promise<VisitsDocument> {
    const { _id } = await getEventFromDb(slug);
    const visit = await getVisitInDb(_id, userId);

    return visit || (await addVisitInDb(_id, userId));
  }

  static async deleteVisit(slug: string, userId: string): Promise<void> {
    const { _id } = await getEventFromDb(slug);
    const visit = await getVisitInDb(_id, userId);

    if (!visit) {
      throw new AppError("Visit not found", 404);
    }

    await deleteVisitInDb(_id, userId);
  }

  static async isVisited(
    eventId: Types.ObjectId,
    userId: string
  ): Promise<boolean> {
    const visit = await getVisitInDb(eventId, userId);

    return !!visit;
  }
}
