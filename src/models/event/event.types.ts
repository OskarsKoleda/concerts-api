export enum EventCategory {
  MusicConcert = "Music Concert",
  MusicFestival = "Music Festival",
  Theater = "Theater",
  CreativeEvening = "Creative Evening",
}

export type EventCreationFields = Omit<
  EventModelFields,
  "slug" | "publicId" | "url"
>;

export interface EventModelFields {
  title: string;
  slug: string;
  category: EventCategory;
  bands: string[];
  city: string;
  location?: string;
  ticketPrice?: number;
  date: Date;
  endDate?: Date;
  publicId: string;
  url: string;
}
