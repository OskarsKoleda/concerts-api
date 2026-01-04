import { mongo } from "mongoose";
import { EventCategory } from "./event.constants";

// 1. Database/Model layer - what's stored in MongoDB
export interface EventDocument {
  _id: mongo.ObjectId;
  title: string;
  slug: string;
  category: EventCategory;
  bands?: string[];
  city: string;
  location?: string;
  ticketPrice: number;
  date: Date;
  endDate?: Date;
  publicId?: string;
  url?: string;
  owner: string;
}

// 2. Response layer - what's sent back to the client
export interface PopulatedEventDocument extends Omit<EventDocument, "owner"> {
  owner: {
    _id: mongo.ObjectId;
    name: string;
  };
  isVisited?: boolean;
}

// 3. Input layer - what comes from the client (for creation)
export type CreateEventInput = Omit<
  EventDocument,
  "_id" | "slug" | "publicId" | "url" | "owner" | "bands"
> & {
  bands?: string[];
};

// 4. Update layer - what comes from the client (for update)
export type UpdateEventInput = Partial<CreateEventInput>;

// 5. Database operations - what's inserted/updated in DB
export type EventRecord = Omit<EventDocument, "_id" | "slug"> & {
  _id?: mongo.ObjectId | string;
};
