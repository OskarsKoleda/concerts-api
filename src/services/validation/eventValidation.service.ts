import {
  CreateEventInput,
  UpdateEventInput,
} from "../../models/event/event.types";
import {
  validateEventPatch,
  validateEventPost,
} from "../../RESTValidators/event.validator";
import { AppError } from "../../utils/AppError";

export const validateEventCreateBody = (
  event: CreateEventInput
): CreateEventInput => {
  const { error, value } = validateEventPost(event);

  if (error) {
    throw new AppError(
      error.details?.[0]?.message || "Invalid event data",
      400
    );
  }

  return value;
};

export const validateEventUpdatedBody = (
  event: Partial<CreateEventInput>
): UpdateEventInput => {
  const { error, value } = validateEventPatch(event);

  if (error) {
    throw new AppError(
      error.details?.[0]?.message || "Invalid event data",
      400
    );
  }

  return value;
};
