import mongoose from "mongoose";
import request from "supertest";
import { server } from "../../src/app";
import { EventCategory } from "../../src/models/event/event.constants";
import { EventModel } from "../../src/models/event/event.model";
import { EventDocument } from "../../src/models/event/event.types";
import { UserModel } from "../../src/models/user/user.model";

const mockedUser = {
  name: "Test User",
  email: "test@example.com",
  age: 30,
  password: "password123",
};

describe("/api/events", () => {
  let mockedOwnerId: mongoose.Types.ObjectId;
  let token: string;
  let mockedEventToInsert: any;

  beforeAll(async () => {
    const user = await UserModel.create(mockedUser);

    mockedOwnerId = user._id;
    token = user.generateAuthToken();

    mockedEventToInsert = {
      title: "Title 1",
      slug: "title-1",
      category: EventCategory.MusicConcert,
      bands: ["band1", "band2"],
      city: "city",
      ticketPrice: 1,
      date: "2025-06-19",
      ownerId: mockedOwnerId,
    };
  });

  afterEach(async () => {
    await EventModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    mongoose.connection.close();
    server.close();
  });

  describe("GET /", () => {
    it("should return all events", async () => {
      await EventModel.collection.insertMany([
        { ...mockedEventToInsert, title: "Title 1", slug: "title-1" },
        { ...mockedEventToInsert, title: "Title 2", slug: "title-2" },
      ]);

      const { body, status } = await request(server).get("/events");

      expect(status).toBe(200);
      expect(body.length).toBe(2);

      expect(
        body.some((event: EventDocument) => event.title === "Title 1")
      ).toBeTruthy();

      expect(
        body.some((event: EventDocument) => event.title === "Title 2")
      ).toBeTruthy();
    });

    it("should return filtered events by title", async () => {
      await EventModel.collection.insertMany([
        { ...mockedEventToInsert, title: "Title 3", slug: "title-3" },
        { ...mockedEventToInsert, title: "Title 4", slug: "title-4" },
      ]);

      const { body, status } = await request(server)
        .get("/events")
        .query({ title: "Title 4" });

      expect(status).toBe(200);
      expect(body.length).toBe(1);
      expect(body[0].title).toBe("Title 4");
    });
  });

  describe("GET /:slug", () => {
    it("should return OK when valid slug is passed", async () => {
      const date = new Date();
      const mockedEvent = {
        title: "Title 1",
        slug: "title-1",
        category: EventCategory.MusicConcert,
        bands: ["band1", "band2"],
        city: "city",
        ticketPrice: 1,
        date: date,
        ownerId: mockedOwnerId,
      };

      await EventModel.create(mockedEvent);

      const { status, body } = await request(server).get("/events/title-1");

      expect(status).toBe(200);
      expect(body.title).toBe(mockedEvent.title);
      expect(body.slug).toBe(mockedEvent.slug);
      expect(body.category).toBe(mockedEvent.category);
      expect(body.bands).toEqual(mockedEvent.bands);
      expect(body.city).toBe(mockedEvent.city);
      expect(body.ticketPrice).toBe(mockedEvent.ticketPrice);
      expect(body.date).toEqual(mockedEvent.date.toISOString());
      expect(body).toHaveProperty("_id");
      expect(body).toHaveProperty("owner");
      expect(body.owner).toHaveProperty("id");
      expect(body.owner).toHaveProperty("name");
    });

    it("should return NOT FOUND when no events in db", async () => {
      const { body, status } = await request(server).get("/events/bad-event");

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found");
    });
  });

  describe("POST /", () => {
    const mockedValidEvent = {
      title: "Title 1",
      category: EventCategory.MusicConcert,
      bands: "band 1,band 2",
      city: "city",
      ticketPrice: 1,
      date: new Date(),
    };

    const createEvent = async (event: any) => {
      return await request(server)
        .post("/events")
        .set("Cookie", [`token=${token}`])
        .send(event);
    };

    it("should return CREATED when valid event data provided", async () => {
      const { body, status } = await createEvent(mockedValidEvent);

      expect(status).toBe(201);
      expect(body.title).toBe(mockedValidEvent.title);
      expect(body.slug).toBe("title-1");
      expect(body.category).toBe(mockedValidEvent.category);
      expect(body.city).toBe(mockedValidEvent.city);
      expect(body.ticketPrice).toBe(mockedValidEvent.ticketPrice);
      expect(new Date(body.date)).toEqual(mockedValidEvent.date);
      expect(body.bands).toEqual(["band 1", "band 2"]);
      expect(body).toHaveProperty("_id");
      expect(body).toHaveProperty("owner");
      expect(body.owner).toHaveProperty("id");
      expect(body.owner).toHaveProperty("name");
    });

    it("should return CONFLICT when duplicate title is provided", async () => {
      await createEvent(mockedValidEvent);
      const { body, status } = await createEvent(mockedValidEvent);

      expect(status).toBe(409);
      expect(body.message).toBe("Event with this title already exists");
    });

    it("should return BAD REQUEST when invalid event data provided", async () => {
      const event = { ...mockedValidEvent, title: 1 };
      const { body, status } = await createEvent(event);

      expect(status).toBe(400);
      expect(body.message).toBe("Title must be a string");
    });

    it("should return UNAUTHORIZED when no token is provided", async () => {
      const { body, status } = await request(server)
        .post("/events")
        .send(mockedValidEvent);

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });
  });

  describe("DELETE /:slug", () => {
    it("should return NO CONTENT when valid slug is passed", async () => {
      await EventModel.create(mockedEventToInsert);

      const { status } = await request(server)
        .delete("/events/title-1")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(204);
    });

    it("should return UNAUTHORIZED when no token is provided", async () => {
      await EventModel.create(mockedEventToInsert);

      const { body, status } = await request(server).delete("/events/title-1");

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });

    it("should return NOT FOUND when event does not exist", async () => {
      const { body, status } = await request(server)
        .delete("/events/bad-title")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found");
    });
  });
  describe("PATCH /:slug", () => {
    it("should return OK when valid slug and event data is passed", async () => {
      await EventModel.create(mockedEventToInsert);

      const updatedEventData = { title: "Updated Title" };

      const { body, status } = await request(server)
        .patch("/events/title-1")
        .set("Cookie", [`token=${token}`])
        .send(updatedEventData);

      expect(status).toBe(200);
      expect(body.title).toBe(updatedEventData.title);
      expect(body.slug).toBe("updated-title");
    });

    it("should return CONFLICT when duplicate title is provided", async () => {
      await EventModel.create(mockedEventToInsert);

      const updatedEventData = { title: mockedEventToInsert.title };

      const { body, status } = await request(server)
        .patch(`/events/${mockedEventToInsert.slug}`)
        .set("Cookie", [`token=${token}`])
        .send(updatedEventData);

      expect(status).toBe(409);
      expect(body.message).toBe("Event with this title already exists");
    });

    it("should return UNAUTHORIZED when no token is provided", async () => {
      await EventModel.create(mockedEventToInsert);

      const updatedEventData = { title: "Updated Title" };
      const { body, status } = await request(server)
        .patch("/events/title-1")
        .send(updatedEventData);

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });
  });
});
