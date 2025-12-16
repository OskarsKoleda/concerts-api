import { model, Schema } from "mongoose";
import { VisitsDocument } from "./visits.types";

const visitsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
});

export const VisitsModel = model<VisitsDocument>("Visits", visitsSchema);
