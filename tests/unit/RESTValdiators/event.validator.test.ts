import { EventCategory } from "../../../src/models/event/event.constants";
import { EventCreationFields } from "../../../src/models/event/event.types";
import { validateEvent } from "../../../src/RESTValidators/event.validator";

const mockedValidEvent: EventCreationFields = {
  title: "Title 1",
  category: EventCategory.MusicConcert,
  bands: ["band1", "band2"],
  city: "Desel",
  ticketPrice: 309,
  date: new Date(),
};

describe("should return BAD REQUEST, when", () => {
  // TITLE

  it("title is a number", async () => {
    const event = { ...mockedValidEvent, title: 1 } as any;
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Title must be a string");
  });

  it("title is an empty string", async () => {
    const event = { ...mockedValidEvent, title: "" };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Title cannot be an empty string");
  });

  it("title is less than 3 characters", async () => {
    const event = { ...mockedValidEvent, title: "aa" };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Title must be at least 3 characters");
  });

  it("title is more than 255 characters", async () => {
    const event = { ...mockedValidEvent, title: Array(257).join("a") };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Title must be at most 255 characters");
  });

  it("title is missing", async () => {
    const { title, ...eventWithoutTitle } = mockedValidEvent;
    const { error } = validateEvent(eventWithoutTitle as any);

    expect(error?.message).toMatch("Title is required");
  });

  // CATEGORY

  it("invalid category provided", async () => {
    const event = { ...mockedValidEvent, category: "bad" as EventCategory };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Category must be one of the allowed values");
  });

  it("category is missing", async () => {
    const { category, ...eventWithoutCategory } = mockedValidEvent;
    const { error } = validateEvent(eventWithoutCategory as any);

    expect(error?.message).toBe("Category is required");
  });

  // BANDS

  it("band name is not a string", async () => {
    const event = { ...mockedValidEvent, bands: [1] };
    const { error } = validateEvent(event as any);

    expect(error?.message).toBe("Band name must be a string");
  });

  it("band name is an empty string", async () => {
    const event = { ...mockedValidEvent, bands: [""] };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Band name is required");
  });

  it("band name is less than 3 characters", async () => {
    const event = { ...mockedValidEvent, bands: ["aa"] };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Band name must be at least 3 characters");
  });

  it("band name is more than 255 characters", async () => {
    const event = { ...mockedValidEvent, bands: [Array(257).join("a")] };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Band name must be at most 255 characters");
  });

  it.each([EventCategory.Theater, EventCategory.CreativeEvening])(
    "bands provided with the invalid category %s",
    (category: EventCategory) => {
      const event = {
        ...mockedValidEvent,
        bands: ["band 1"],
        category: category,
      };

      const { error } = validateEvent(event);

      expect(error?.message).toBe(
        "Bands are only allowed for music categories"
      );
    }
  );

  it.each([EventCategory.MusicConcert, EventCategory.MusicFestival])(
    "bands is not provided for %s",
    (category: EventCategory) => {
      const event = { ...mockedValidEvent, category: category };
      const { bands, ...eventWithoutBands } = event;

      const { error } = validateEvent(eventWithoutBands as any);

      expect(error?.message).toBe("Bands are required");
    }
  );

  it("bands are empty", async () => {
    const event = { ...mockedValidEvent, bands: [] };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("At least one band is required");
  });

  it("bands is not an array", async () => {
    const event = { ...mockedValidEvent, bands: { aaa: "bbb" } };
    const { error } = validateEvent(event as any);

    expect(error?.message).toBe("Bands must be an array");
  });

  // CITY

  it("city is a number", async () => {
    const event = { ...mockedValidEvent, city: 1 };
    const { error } = validateEvent(event as any);

    expect(error?.message).toBe("City must be a string");
  });

  it("city is an empty string", async () => {
    const event = { ...mockedValidEvent, city: "" };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("City is required");
  });

  it("city is less than 3 characters", async () => {
    const event = { ...mockedValidEvent, city: "aa" };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("City must be at least 3 characters");
  });

  it("city is more than 255 characters", async () => {
    const event = { ...mockedValidEvent, city: Array(257).join("a") };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("City must be at most 255 characters");
  });

  it("city is missing", async () => {
    const { city, ...eventWithoutCity } = mockedValidEvent;
    const { error } = validateEvent(eventWithoutCity as any);

    expect(error?.message).toBe("City is required");
  });

  // LOCATION

  it("location is a number", async () => {
    const event = { ...mockedValidEvent, location: 1 };
    const { error } = validateEvent(event as any);

    expect(error?.message).toBe("Location must be a string");
  });

  it("location is less than 3 characters", async () => {
    const event = { ...mockedValidEvent, location: "aa" };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Location must be at least 3 characters");
  });

  it("location is more than 255 characters", async () => {
    const event = { ...mockedValidEvent, location: Array(257).join("a") };
    const { error } = validateEvent(event);

    expect(error?.message).toBe("Location must be at most 255 characters");
  });

  // TICKET PRICE

  it("ticketPrice is a string", async () => {
    const event = { ...mockedValidEvent, ticketPrice: "aaa" };
    const { error } = validateEvent(event as any);

    expect(error?.message).toBe("Ticket Price must be a number");
  });

  it("ticketPrice is negative", async () => {
    const event = { ...mockedValidEvent, ticketPrice: -1 };
    const { error } = validateEvent(event);

    expect(error?.message).toBe(
      "Ticket Price must be greater than or equal to 0"
    );
  });

  it("ticketPrice is more than 999", async () => {
    const event = { ...mockedValidEvent, ticketPrice: 1000 };
    const { error } = validateEvent(event);

    expect(error?.message).toBe(
      "Ticket Price must be less than or equal to 999"
    );
  });

  it("ticketPrice is missing", async () => {
    const { ticketPrice, ...eventWithoutTicketPrice } = mockedValidEvent;
    const { error } = validateEvent(eventWithoutTicketPrice as any);

    expect(error?.message).toBe("Ticket Price is required");
  });

  // DATE

  it("date is invalid", async () => {
    const event = { ...mockedValidEvent, date: "2025-31-31" };
    const { error } = validateEvent(event as any);

    expect(error?.message).toBe("Date must be a valid date");
  });

  it("date is missing", async () => {
    const { date, ...eventWithoutDate } = mockedValidEvent;
    const { error } = validateEvent(eventWithoutDate as any);

    expect(error?.message).toBe("Date is required");
  });

  // END DATE

  it("end date is invalid", async () => {
    const event = { ...mockedValidEvent, endDate: "2025-31-31" };
    const { error } = validateEvent(event as any);

    expect(error?.message).toBe("End Date must be a valid date");
  });

  it("end date is before date", async () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const event = {
      ...mockedValidEvent,
      date: now,
      endDate: yesterday,
    };

    const { error } = validateEvent(event);

    expect(error?.message).toBe("End Date must be equal to or after date");
  });
});
