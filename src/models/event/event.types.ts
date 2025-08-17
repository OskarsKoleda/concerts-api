import { EventCategory } from "./event.constants";

export type EventRecordFields = Omit<EventModelFields, "slug">;

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
  ticketPrice: number;
  date: Date;
  endDate?: Date;
  publicId: string;
  url: string;
}
