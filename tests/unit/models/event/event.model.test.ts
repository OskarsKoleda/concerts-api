import {
  EventCategory,
  MUSIC_CATEGORIES,
} from "../../../../src/models/event/event.constants";
import { EventModel } from "../../../../src/models/event/event.model";

const mockedEvent = {
  title: "My Concert 2025",
  category: EventCategory.MusicConcert,
  bands: ["Band 1", "Band 2"],
  city: "Paris",
  ticketPrice: 25,
  date: "2025-12-31",
  publicId: 123,
  url: "www.poster.com",
};

describe("eventSchema should throw a validation error, when", () => {
  // TITLE
  it("title is missing", async () => {
    const { title, ...eventWithoutTitle } = mockedEvent;
    const event = new EventModel(eventWithoutTitle);

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: title: Path `title` is required."
    );
  });

  it("title is shorter than 3 characters", async () => {
    const event = new EventModel({ ...mockedEvent, title: "AB" });

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: title: Path `title` (`AB`) is shorter than the minimum allowed length (3)."
    );
  });

  it("title is longer than 255 characters", async () => {
    const longTitle = "A".repeat(256);
    const event = new EventModel({ ...mockedEvent, title: longTitle });

    await expect(event.save()).rejects.toThrow(
      `Event validation failed: title: Path \`title\` (\`${longTitle}\`) is longer than the maximum allowed length (255).`
    );
  });

  // CATEGORY
  it("category is missing", async () => {
    const { category, ...eventWithoutCategory } = mockedEvent;
    const event = new EventModel(eventWithoutCategory);

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: category: Path `category` is required."
    );
  });

  it("category is not in enum", async () => {
    const event = new EventModel({
      ...mockedEvent,
      category: "InvalidCategory",
    });

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: category: `InvalidCategory` is not a valid enum value for path `category`."
    );
  });

  // BANDS
  it.each(MUSIC_CATEGORIES)(
    "bands is not provided for music category - %s",
    async (musicCategory) => {
      const { bands, ...eventWithoutBands } = mockedEvent;

      const event = new EventModel({
        ...eventWithoutBands,
        category: musicCategory,
      });

      await expect(event.save()).rejects.toThrow(
        "Event validation failed: bands: For the event category Music Concert or Music Festival, bands cannot be empty"
      );
    }
  );

  it.each(MUSIC_CATEGORIES)(
    "bands is empty for music category - %s",
    async (musicCategory) => {
      const event = new EventModel({
        ...mockedEvent,
        category: musicCategory,
        bands: [],
      });

      await expect(event.save()).rejects.toThrow(
        "Event validation failed: bands: For the event category Music Concert or Music Festival, bands cannot be empty"
      );
    }
  );

  it.each([EventCategory.CreativeEvening, EventCategory.Theater])(
    "bands provided for non-music category - %s",
    async (nonMusicCategory) => {
      const event = new EventModel({
        ...mockedEvent,
        category: [nonMusicCategory],
      });

      await expect(event.save()).rejects.toThrow(
        "Bands are only allowed for music categories"
      );
    }
  );

  // CITY
  it("city is missing", async () => {
    const { city, ...eventWithoutCity } = mockedEvent;
    const event = new EventModel(eventWithoutCity);

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: city: Path `city` is required."
    );
  });

  it("city is shorter than 3 characters", async () => {
    const event = new EventModel({ ...mockedEvent, city: "NY" });

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: city: Path `city` (`NY`) is shorter than the minimum allowed length (3)."
    );
  });

  it("city is longer than 255 characters", async () => {
    const longCity = "C".repeat(256);
    const event = new EventModel({ ...mockedEvent, city: longCity });

    await expect(event.save()).rejects.toThrow(
      `Event validation failed: city: Path \`city\` (\`${longCity}\`) is longer than the maximum allowed length (255).`
    );
  });

  // LOCATION
  it("location is shorter than 3 characters", async () => {
    const event = new EventModel({ ...mockedEvent, location: "A" });

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: location: Path `location` (`A`) is shorter than the minimum allowed length (3)."
    );
  });

  it("location is longer than 255 characters", async () => {
    const longLocation = "L".repeat(256);
    const event = new EventModel({ ...mockedEvent, location: longLocation });

    await expect(event.save()).rejects.toThrow(
      `Event validation failed: location: Path \`location\` (\`${longLocation}\`) is longer than the maximum allowed length (255).`
    );
  });

  // TICKET PRICE
  it("ticket price is missing", async () => {
    const { ticketPrice, ...eventWithoutTicketPrice } = mockedEvent;
    const event = new EventModel(eventWithoutTicketPrice);

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: ticketPrice: Path `ticketPrice` is required."
    );
  });

  it("ticket price is less than 0", async () => {
    const event = new EventModel({ ...mockedEvent, ticketPrice: -5 });

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: ticketPrice: Path `ticketPrice` (-5) is less than minimum allowed value (0)."
    );
  });

  it("ticket price is greater than 999", async () => {
    const event = new EventModel({ ...mockedEvent, ticketPrice: 1000 });

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: ticketPrice: Path `ticketPrice` (1000) is more than maximum allowed value (999)."
    );
  });

  // DATE
  it("date is missing", async () => {
    const { date, ...eventWithoutDate } = mockedEvent;
    const event = new EventModel(eventWithoutDate);

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: date: Path `date` is required."
    );
  });

  // END DATE
  it("endDate is before date", async () => {
    const event = new EventModel({
      ...mockedEvent,
      date: "2025-12-31",
      endDate: "2025-12-30",
    });

    await expect(event.save()).rejects.toThrow(
      "End date must be later than start date"
    );
  });

  it("endDate is set but date is missing", async () => {
    const { date, ...eventData } = mockedEvent;
    const event = new EventModel({
      ...eventData,
      endDate: "2025-12-31",
    });

    await expect(event.save()).rejects.toThrow(
      "Start date is required when end date is provided"
    );
  });

  // PUBLIC ID
  it("publicId is missing", async () => {
    const { publicId, ...eventDataWithoutPublicId } = mockedEvent;
    const event = new EventModel(eventDataWithoutPublicId);

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: publicId: Path `publicId` is required."
    );
  });

  // URL
  it("url is missing", async () => {
    const { url, ...eventDataWithoutUrl } = mockedEvent;
    const event = new EventModel(eventDataWithoutUrl);

    await expect(event.save()).rejects.toThrow(
      "Event validation failed: url: Path `url` is required."
    );
  });
});
