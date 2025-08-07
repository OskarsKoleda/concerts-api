import { model, Schema } from "mongoose";
import slugify from "slugify";

import { MUSIC_CATEGORIES } from "./event.constants";
import { EventCategory, EventModelFields } from "./event.types";

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  slug: { type: String, unique: true },
  category: {
    type: String,
    enum: Object.values(EventCategory),
    required: true,
  },
  bands: {
    type: [String],
    required: function (this: EventModelFields) {
      return MUSIC_CATEGORIES.includes(
        this.category as (typeof MUSIC_CATEGORIES)[number]
      );
    },
    validate: {
      validator: function (this: EventModelFields, bands: string[]) {
        if (
          MUSIC_CATEGORIES.includes(
            this.category as (typeof MUSIC_CATEGORIES)[number]
          )
        ) {
          return Array.isArray(bands) && bands.length > 0;
        }

        return true;
      },
      message: `For the event category ${EventCategory.MusicConcert} or ${EventCategory.MusicFestival}, bands cannot be empty`,
    },
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  location: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 255,
  },
  ticketPrice: {
    type: Number,
    required: false,
    min: 0,
    max: 999,
  },
  date: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
    validate: {
      validator: function (this: EventModelFields, endDate: Date) {
        if (!endDate) {
          return true;
        }

        if (!this.date) {
          throw new Error("Start date is required when end date is provided");
        }

        const startDateTime = new Date(this.date).getTime();
        const endDateTime = new Date(endDate).getTime();

        if (endDateTime < startDateTime) {
          throw new Error("End date must be later than start date");
        }

        return true;
      },
    },
  },
});

eventSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

export const EventModel = model<EventModelFields>("Event", eventSchema);
