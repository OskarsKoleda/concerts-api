import mongoose from "mongoose";
import { VisitsModel } from "../../../src/models/visits/visits.model";

const MOCK_USER_ID = new mongoose.Types.ObjectId("64b64c4f8f1a2c001f6e4b8a");
const MOCK_EVENT_ID = new mongoose.Types.ObjectId("64b64c4f8f1a2c001f6e4b8b");

const mockedVisit = {
  userId: MOCK_USER_ID,
  eventId: MOCK_EVENT_ID,
};

describe("visitsSchema should throw a validation error, when", () => {
  it("userId is missing", async () => {
    const { userId, ...visitWithoutUserId } = mockedVisit;
    const visit = new VisitsModel(visitWithoutUserId);

    await expect(visit.save()).rejects.toThrow(
      "Visits validation failed: userId: Path `userId` is required."
    );
  });

  it("eventId is missing", async () => {
    const { eventId, ...visitWithoutEventId } = mockedVisit;
    const visit = new VisitsModel(visitWithoutEventId);

    await expect(visit.save()).rejects.toThrow(
      "Visits validation failed: eventId: Path `eventId` is required."
    );
  });
});
