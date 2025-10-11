import { mongo } from "mongoose";
import { EventCategory } from "./event.constants";

// 1. Database/Model layer - what's stored in MongoDB
export interface EventDocument {
  title: string;
  slug: string;
  category: EventCategory;
  bands: string[];
  city: string;
  location?: string;
  ticketPrice: number;
  date: Date;
  endDate?: Date;
  publicId?: string;
  url?: string;
  ownerId: string;
}

export interface PopulatedEventDocument extends Omit<EventDocument, "ownerId"> {
  ownerId: {
    _id: mongo.ObjectId;
    name: string;
  };
}

// 2. Input layer - what comes from the client (for creation)
export type CreateEventInput = Omit<
  EventDocument,
  "slug" | "publicId" | "url" | "ownerId"
>;

// 3. Update layer - what comes from the client (for updates)
export type UpdateEventInput = Partial<CreateEventInput>;

// 4. Response layer - what's sent back to the client
export interface EventResponse extends Omit<EventDocument, "ownerId"> {
  owner: {
    id: mongo.ObjectId;
    name: string;
  };
}

// 5. Database operations - what's inserted/updated in DB
export type EventRecord = Omit<EventDocument, "slug">;
