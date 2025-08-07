export enum EventCategory {
  MusicConcert = "Music Concert",
  MusicFestival = "Music Festival",
  Theater = "Theater",
  CreativeEvening = "Creative Evening",
}

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
}

export type EventCreationFields = Omit<EventModelFields, "slug">;
