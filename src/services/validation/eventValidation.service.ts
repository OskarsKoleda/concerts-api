import { EventCreationFields } from "../../models/event/event.types";
import {
  validateEventPatch,
  validateEventPost,
} from "../../RESTValidators/event.validator";
import { AppError } from "../../utils/AppError";

export const validateEventCreateBody = (event: EventCreationFields) => {
  const { error } = validateEventPost(event);

  if (error) {
    throw new AppError(
      error.details?.[0]?.message || "Invalid event data",
      400
    );
  }
};

export const validateEventUpdatedBody = (
  event: Partial<EventCreationFields>
) => {
  const { error } = validateEventPatch(event);

  if (error) {
    throw new AppError(
      error.details?.[0]?.message || "Invalid event data",
      400
    );
  }
};
