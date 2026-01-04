import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../src/app";
import { EventCategory } from "../../src/models/event/event.constants";
import { EventModel } from "../../src/models/event/event.model";
import { EventDocument } from "../../src/models/event/event.types";
import { UserModel } from "../../src/models/user/user.model";
import { VisitsModel } from "../../src/models/visits/visits.model";
import { connectDb } from "../../src/startup/db";

const mockedUserData = {
  name: "Test User",
  email: "test@example.com",
  age: 30,
  password: "password123",
};

describe("/api/events", () => {
  let mockedOwnerId: mongoose.Types.ObjectId;
  let mockedEventData: any;
  let token: string;

  beforeAll(async () => {
    await connectDb();
    const user = await UserModel.create(mockedUserData);

    mockedOwnerId = user._id;
    token = user.generateAuthToken();

    mockedEventData = {
      title: "Title 1",
      slug: "title-1",
      category: EventCategory.MusicConcert,
      bands: ["band1", "band2"],
      city: "city",
      ticketPrice: 1,
      date: "2025-06-19",
      owner: mockedOwnerId,
    };
  });

  afterEach(async () => {
    await EventModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all events", async () => {
      await EventModel.collection.insertMany([
        { ...mockedEventData, title: "Title 1", slug: "title-1" },
        { ...mockedEventData, title: "Title 2", slug: "title-2" },
      ]);

      const { body, status } = await request(app)
        .get("/events")
        .set("Cookie", [`token=${token}`]);

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
        { ...mockedEventData, title: "Title 3", slug: "title-3" },
        { ...mockedEventData, title: "Title 4", slug: "title-4" },
      ]);

      const { body, status } = await request(app)
        .get("/events")
        .query({ title: "Title 4" })
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(200);
      expect(body.length).toBe(1);
      expect(body[0].title).toBe("Title 4");
    });

    it("should return events with isVisited=true, if user has visited events", async () => {
      const { _id: eventId1 } = await EventModel.create({
        ...mockedEventData,
        title: "Title 5",
        slug: "title-5",
      });
      const { _id: eventId2 } = await EventModel.create({
        ...mockedEventData,
        title: "Title 6",
        slug: "title-6",
      });

      await VisitsModel.insertMany([
        {
          eventId: eventId1,
          userId: mockedOwnerId,
        },
        {
          eventId: eventId2,
          userId: mockedOwnerId,
        },
      ]);

      const { body, status } = await request(app)
        .get("/events")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(200);
      expect(body.length).toBe(2);
      expect(body[0].isVisited).toBe(true);
      expect(body[1].isVisited).toBe(true);
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
        owner: mockedOwnerId,
      };

      await EventModel.create(mockedEvent);

      const { status, body } = await request(app)
        .get("/events/title-1")
        .set("Cookie", [`token=${token}`]);

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
      expect(body.owner).toHaveProperty("_id");
      expect(body.owner).toHaveProperty("name");
      expect(body).toHaveProperty("isVisited");
      expect(body.isVisited).toBe(false);
    });

    it("should return NOT FOUND when no events in db", async () => {
      const { body, status } = await request(app)
        .get("/events/bad-event")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found");
    });

    it("should return isVisited=true when user has visited event", async () => {
      const { _id: eventId } = await EventModel.create({
        ...mockedEventData,
        title: "Title 1",
        slug: "title-1",
      });

      await VisitsModel.create({
        eventId,
        userId: mockedOwnerId,
      });

      const { body, status } = await request(app)
        .get("/events/title-1")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(200);
      expect(body.isVisited).toBe(true);
    });
  });

  describe("POST /", () => {
    const mockedValidEvent = {
      title: "Title 1",
      category: EventCategory.MusicConcert,
      bands: ["band 1", "band 2"],
      city: "city",
      ticketPrice: 1,
      date: new Date(),
    };

    const createEvent = async (event: any) => {
      return await request(app)
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
      expect(body.owner).toHaveProperty("_id");
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
      const { body, status } = await request(app)
        .post("/events")
        .send(mockedValidEvent);

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });
  });

  describe("DELETE /:slug", () => {
    it("should return NO CONTENT when valid slug is passed", async () => {
      await EventModel.create(mockedEventData);

      const { status } = await request(app)
        .delete("/events/title-1")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(204);
    });

    it("should return UNAUTHORIZED when no token is provided", async () => {
      await EventModel.create(mockedEventData);

      const { body, status } = await request(app).delete("/events/title-1");

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });

    it("should return NOT FOUND when event does not exist", async () => {
      const { body, status } = await request(app)
        .delete("/events/bad-title")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found or unauthorized");
    });

    it("should not allow deleting event if the user is not the owner", async () => {
      const secondUser = await UserModel.create(mockedUserData);
      const event = await EventModel.create(mockedEventData);

      const { body, status } = await request(app)
        .delete(`/events/${event.slug}`)
        .set("Cookie", [`token=${secondUser.generateAuthToken()}`]);

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found or unauthorized");
    });

    it("should delete all visits when event is deleted", async () => {
      const event = await EventModel.create(mockedEventData);

      await VisitsModel.create({
        eventId: event._id,
        userId: mockedOwnerId,
      });

      const { status } = await request(app)
        .delete(`/events/${event.slug}`)
        .set("Cookie", [`token=${token}`]);

      const visits = await VisitsModel.find({ eventId: event._id });

      expect(status).toBe(204);
      expect(visits).toHaveLength(0);
    });
  });

  describe("PATCH /:slug", () => {
    it("should return OK when valid slug and event data is passed", async () => {
      await EventModel.create(mockedEventData);

      const updatedEventData = { title: "Updated Title" };

      const { body, status } = await request(app)
        .patch("/events/title-1")
        .set("Cookie", [`token=${token}`])
        .send(updatedEventData);

      expect(status).toBe(200);
      expect(body.title).toBe(updatedEventData.title);
      expect(body.slug).toBe("updated-title");
    });

    it("should return CONFLICT when duplicate title is provided", async () => {
      await EventModel.create(mockedEventData);

      const updatedEventData = { title: mockedEventData.title };

      const { body, status } = await request(app)
        .patch(`/events/${mockedEventData.slug}`)
        .set("Cookie", [`token=${token}`])
        .send(updatedEventData);

      expect(status).toBe(409);
      expect(body.message).toBe("Event with this title already exists");
    });

    it("should return UNAUTHORIZED when no token is provided", async () => {
      await EventModel.create(mockedEventData);

      const updatedEventData = { title: "Updated Title" };
      const { body, status } = await request(app)
        .patch("/events/title-1")
        .send(updatedEventData);

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });

    it("should not allow updating event if the user is not the owner", async () => {
      const secondUser = await UserModel.create(mockedUserData);
      const event = await EventModel.create(mockedEventData);

      const { body, status } = await request(app)
        .patch(`/events/${event.slug}`)
        .set("Cookie", [`token=${secondUser.generateAuthToken()}`]);

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found or unauthorized");
    });
  });

  describe("POST /:slug/visit", () => {
    it("should return NO CONTENT when valid slug is passed", async () => {
      await EventModel.create(mockedEventData);

      const { status } = await request(app)
        .post(`/events/${mockedEventData.slug}/visit`)
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(204);
    });

    it("should return NOT FOUND when no events in db", async () => {
      const { body, status } = await request(app)
        .post("/events/bad-event/visit")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found");
    });

    it("should return UNAUTHORIZED when no token is provided", async () => {
      const { body, status } = await request(app).post("/events/title-1/visit");

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });
  });

  describe("DELETE /:slug/visit", () => {
    it("should return NO CONTENT when visit is successfully deleted", async () => {
      const { _id } = await EventModel.create(mockedEventData);

      await VisitsModel.create({
        eventId: _id,
        userId: mockedOwnerId,
      });

      const { status } = await request(app)
        .delete(`/events/${mockedEventData.slug}/visit`)
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(204);
    });

    it("should return NOT FOUND when no events in db", async () => {
      const { body, status } = await request(app)
        .delete("/events/bad-event/visit")
        .set("Cookie", [`token=${token}`]);

      expect(status).toBe(404);
      expect(body.message).toBe("Event not found");
    });

    it("should return UNAUTHORIZED when no token is provided", async () => {
      const { body, status } = await request(app).delete(
        "/events/title-1/visit"
      );

      expect(status).toBe(401);
      expect(body.message).toBe("Access denied. No token provided.");
    });
  });
});
