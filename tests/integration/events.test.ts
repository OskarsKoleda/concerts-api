import mongoose from "mongoose";
import request from "supertest";
import { server } from "../../src/app"; // adjust path if needed
import { EventCategory } from "../../src/models/event/event.constants";
import { EventModel } from "../../src/models/event/event.model";
import { EventModelFields } from "../../src/models/event/event.types";

describe("/api/events", () => {
  afterEach(async () => {
    await EventModel.deleteMany({});
  });

  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });

  describe("GET /", () => {
    const mockedEvent = {
      title: "Title 1",
      slug: "title-1",
      category: EventCategory.MusicConcert,
      bands: ["band1", "band2"],
      city: "city",
      ticketPrice: 1,
      date: "2025-06-19",
    };

    it("should return all events", async () => {
      await EventModel.collection.insertMany([
        mockedEvent,
        { ...mockedEvent, title: "Title 2", slug: "title-2" },
      ]);

      const res = await request(server).get("/events");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);

      expect(
        res.body.some((event: EventModelFields) => event.title === "Title 1")
      ).toBeTruthy();

      expect(
        res.body.some((event: EventModelFields) => event.title === "Title 2")
      ).toBeTruthy();
    });
  });

  describe("POST /", () => {
    const mockedValidEvent = {
      title: "Title 1",
      category: EventCategory.MusicConcert,
      bands: "band 1, band2",
      city: "Desel",
      ticketPrice: 309,
      date: new Date(),
    };

    const createEvent = async (event: any) => {
      return request(server).post("/events").send(event);
    };

    it("should create an event when valid event data provided", async () => {
      const res = await createEvent(mockedValidEvent);

      expect(res.status).toBe(201);
    });

    it("should return BAD RESPONSE, when invalid event data provided", async () => {
      const event = { ...mockedValidEvent, title: 1 };
      const res = await createEvent(event);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Title must be a string");
    });
  });
});
