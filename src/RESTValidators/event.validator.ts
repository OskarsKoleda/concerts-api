import Joi, { ValidationResult } from "joi";
import {
  EventCategory,
  MUSIC_CATEGORIES,
} from "../models/event/event.constants";
import { EventCreationFields } from "../models/event/event.types";

export const validateEventPost = (
  event: EventCreationFields
): ValidationResult => {
  return schema.validate(event);
};

export const validateEventPatch = (
  event: Partial<EventCreationFields>
): ValidationResult => {
  const patchSchema = schema.fork(
    Object.keys(schema.describe().keys),
    (field) => field.optional()
  );

  return patchSchema.validate(event);
};

const schema = Joi.object({
  title: Joi.string().required().min(3).max(255).messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be an empty string",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must be at most 255 characters",
    "any.required": "Title is required",
  }),
  category: Joi.string()
    .required()
    .valid(...Object.values(EventCategory))
    .messages({
      "any.only": "Category must be one of the allowed values",
      "any.required": "Category is required",
    }),
  bands: Joi.alternatives().conditional("category", {
    is: Joi.valid(...MUSIC_CATEGORIES),
    then: Joi.array()
      .items(
        Joi.string().min(3).max(255).messages({
          "string.base": "Band name must be a string",
          "string.empty": "Band name is required",
          "string.min": "Band name must be at least 3 characters",
          "string.max": "Band name must be at most 255 characters",
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Bands must be an array",
        "array.min": "At least one band is required",
        "any.required": "Bands are required",
      }),
    otherwise: Joi.forbidden().messages({
      "any.unknown": "Bands are only allowed for music categories",
    }),
  }),
  city: Joi.string().required().min(3).max(255).messages({
    "string.base": "City must be a string",
    "string.empty": "City is required",
    "string.min": "City must be at least 3 characters",
    "string.max": "City must be at most 255 characters",
    "any.required": "City is required",
  }),
  location: Joi.string().min(3).max(255).messages({
    "string.base": "Location must be a string",
    "string.min": "Location must be at least 3 characters",
    "string.max": "Location must be at most 255 characters",
  }),
  ticketPrice: Joi.number().required().min(0).max(999).messages({
    "number.base": "Ticket Price must be a number",
    "number.min": "Ticket Price must be greater than or equal to 0",
    "number.max": "Ticket Price must be less than or equal to 999",
    "any.required": "Ticket Price is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Date must be a valid date",
    "any.required": "Date is required",
  }),
  endDate: Joi.date().min(Joi.ref("date")).messages({
    "date.base": "End Date must be a valid date",
    "date.min": "End Date must be equal to or after date",
  }),
});
