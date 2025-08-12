import mongoose from "mongoose";
import request from "supertest";
import { server } from "../../src/app"; // adjust path if needed
import { MUSIC_CATEGORIES } from "../../src/models/event/event.constants";
import { EventModel } from "../../src/models/event/event.model";
import {
  EventCategory,
  EventModelFields,
} from "../../src/models/event/event.types";

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
      bands: ["band1", "band2"],
      city: "Desel",
      ticketPrice: 309,
      date: "2025-06-19",
    };

    const createEvent = async (event: any) => {
      return request(server).post("/events").send(event);
    };

    describe("should return BAD REQUEST, when", () => {
      // TITLE

      it("title is a number", async () => {
        const event = { ...mockedValidEvent, title: 1 };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Title must be a string");
      });

      it("title is an empty string", async () => {
        const event = { ...mockedValidEvent, title: "" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Title cannot be an empty string");
      });

      it("title is less than 3 characters", async () => {
        const event = { ...mockedValidEvent, title: "aa" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Title must be at least 3 characters");
      });

      it("title is more than 255 characters", async () => {
        const event = { ...mockedValidEvent, title: Array(257).join("a") };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Title must be at most 255 characters");
      });

      it("title is missing", async () => {
        const { title, ...eventWithoutTitle } = mockedValidEvent;

        const res = await request(server)
          .post("/events")
          .send(eventWithoutTitle);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch("Title is required");
      });

      // CATEGORY

      it("invalid category provided", async () => {
        const event = { ...mockedValidEvent, category: "bad" as EventCategory };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "Category must be one of the allowed values"
        );
      });

      it("category is missing", async () => {
        const { category, ...eventWithoutCategory } = mockedValidEvent;

        const res = await request(server)
          .post("/events")
          .send(eventWithoutCategory);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Category is required");
      });

      // BANDS

      it("band name is not a string", async () => {
        const event = { ...mockedValidEvent, bands: [1] };

        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Band name must be a string");
      });

      it("band name is an empty string", async () => {
        const event = { ...mockedValidEvent, bands: [""] };

        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Band name is required");
      });

      it("band name is less than 3 characters", async () => {
        const event = { ...mockedValidEvent, bands: ["aa"] };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "Band name must be at least 3 characters"
        );
      });

      it("band name is more than 255 characters", async () => {
        const event = { ...mockedValidEvent, bands: [Array(257).join("a")] };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "Band name must be at most 255 characters"
        );
      });

      it.each([EventCategory.Theater, EventCategory.CreativeEvening])(
        "bands provided with the invalid category %s",
        async (category: EventCategory) => {
          const event = {
            ...mockedValidEvent,
            bands: ["band 1"],
            category: category,
          };

          const res = await createEvent(event);

          expect(res.status).toBe(400);
          expect(res.body.message).toBe(
            "Bands are only allowed for music categories"
          );
        }
      );

      it.each(MUSIC_CATEGORIES)(
        "bands is not provided for %s",
        async (category: EventCategory) => {
          const event = { ...mockedValidEvent, category: category };
          const { bands, ...eventWithoutBands } = event;

          const res = await createEvent(eventWithoutBands);

          expect(res.status).toBe(400);
          expect(res.body.message).toBe("Bands are required");
        }
      );

      it("bands are empty", async () => {
        const event = { ...mockedValidEvent, bands: [] };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("At least one band is required");
      });

      it("bands are empty", async () => {
        const event = { ...mockedValidEvent, bands: { aaa: "bbb" } };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Bands must be an array");
      });

      // CITY

      it("city is a number", async () => {
        const event = { ...mockedValidEvent, city: 1 };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("City must be a string");
      });

      it("city is and empty string", async () => {
        const event = { ...mockedValidEvent, city: "" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("City is required");
      });

      it("city is less than 3 characters", async () => {
        const event = { ...mockedValidEvent, city: "aa" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("City must be at least 3 characters");
      });

      it("city is more than 255 characters", async () => {
        const event = { ...mockedValidEvent, city: Array(257).join("a") };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("City must be at most 255 characters");
      });

      it("city is missing", async () => {
        const { city, ...eventWithoutCity } = mockedValidEvent;

        const res = await request(server)
          .post("/events")
          .send(eventWithoutCity);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("City is required");
      });

      // LOCATION

      it("location is a number", async () => {
        const event = { ...mockedValidEvent, location: 1 };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Location must be a string");
      });

      it("location is less than 3 characters", async () => {
        const event = { ...mockedValidEvent, location: "aa" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Location must be at least 3 characters");
      });

      it("location is more than 255 characters", async () => {
        const event = { ...mockedValidEvent, location: Array(257).join("a") };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "Location must be at most 255 characters"
        );
      });

      // TICKET PRICE

      it("location is a string", async () => {
        const event = { ...mockedValidEvent, ticketPrice: "aaa" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Ticket Price must be a number");
      });

      it("ticketPrice is negative", async () => {
        const event = { ...mockedValidEvent, ticketPrice: -1 };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "Ticket Price must be greater than or equal to 0"
        );
      });

      it("ticketPrice is more 999", async () => {
        const event = { ...mockedValidEvent, ticketPrice: 1000 };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "Ticket Price must be less than or equal to 999"
        );
      });

      it("ticketPrice is missing", async () => {
        const { ticketPrice, ...eventWithoutTicketPrice } = mockedValidEvent;

        const res = await request(server)
          .post("/events")
          .send(eventWithoutTicketPrice);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Ticket Price is required");
      });

      // DATE

      it("date is invalid", async () => {
        const event = { ...mockedValidEvent, date: "2025-31-31" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Date must be a valid date");
      });

      it("date is missing", async () => {
        const { date, ...eventWithoutDate } = mockedValidEvent;

        const res = await request(server)
          .post("/events")
          .send(eventWithoutDate);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Date is required");
      });

      // END DATE

      it("end date is invalid", async () => {
        const event = { ...mockedValidEvent, endDate: "2025-31-31" };
        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("End Date must be a valid date");
      });

      it("end date is before date", async () => {
        const event = {
          ...mockedValidEvent,
          date: "2025-06-19",
          endDate: "2025-06-18",
        };

        const res = await createEvent(event);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "End Date must be equal to or after date"
        );
      });
    });
  });
});
