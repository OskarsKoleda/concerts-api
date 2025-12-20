import { mongo } from "mongoose";

export interface VisitsDocument {
  _id: mongo.ObjectId;
  userId: mongo.ObjectId;
  eventId: mongo.ObjectId;
}
