import Joi, { ValidationResult } from "joi";
import { EventCategory, EventCreationFields } from "./event.types";

export const validateEvent = (event: EventCreationFields): ValidationResult => {
  const schema = Joi.object({
    title: Joi.string().required().min(3).max(255),
    category: Joi.string()
      .required()
      .valid(...Object.values(EventCategory)),
    bands: Joi.array()
      .items(Joi.string().required().min(3).max(255))
      .min(1)
      .when("category", {
        is: Joi.valid(EventCategory.MusicConcert, EventCategory.MusicFestival),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
    city: Joi.string().required().min(3).max(255),
    location: Joi.string().required().min(3).max(255),
    ticketPrice: Joi.number().required().min(0).max(999),
    date: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref("date")).messages({
      "date.min": "'endDate' must be equal to or after date",
    }),
  });

  return schema.validate(event);
};
