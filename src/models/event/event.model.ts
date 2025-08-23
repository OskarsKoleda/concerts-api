import { model, Schema } from "mongoose";
import slugify from "slugify";

import { EventCategory, MUSIC_CATEGORIES } from "./event.constants";
import { EventModelFields } from "./event.types";

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
    required: true,
    enum: Object.values(EventCategory),
  },
  bands: {
    type: [String],
    validate: [
      {
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
      {
        validator: function (this: EventModelFields, bands: string[]) {
          if (
            !MUSIC_CATEGORIES.includes(
              this.category as (typeof MUSIC_CATEGORIES)[number]
            )
          ) {
            return !bands;
          }

          return true;
        },
        message: "Bands are only allowed for music categories",
      },
    ],
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  location: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0,
    max: 999,
  },
  date: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
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
  publicId: {
    type: String,
  },
  url: {
    type: String,
  },
});

eventSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

export const EventModel = model<EventModelFields>("Event", eventSchema);
