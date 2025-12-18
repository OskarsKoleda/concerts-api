import { Types } from "mongoose";
import { VisitsModel } from "../../models/visits/visits.model";
import { VisitsDocument } from "../../models/visits/visits.types";

export const addVisitInDb = async (
  eventId: Types.ObjectId,
  userId: string
): Promise<VisitsDocument> => {
  const visit = await VisitsModel.create({
    eventId,
    userId,
  });

  return visit;
};

export const getVisitInDb = async (
  eventId: Types.ObjectId,
  userId: string
): Promise<VisitsDocument | null> => {
  return await VisitsModel.findOne({
    eventId,
    userId,
  });
};

export const deleteVisitInDb = async (
  eventId: Types.ObjectId,
  userId: string
): Promise<void> => {
  await VisitsModel.deleteOne({
    eventId,
    userId,
  });
};
