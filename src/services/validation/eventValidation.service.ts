import { EventCreationFields } from "../../models/event/event.types";
import { validateEvent } from "../../RESTValidators/event.validator";
import { AppError } from "../../utils/AppError";

export const validateEventRules = (event: EventCreationFields) => {
  const { error } = validateEvent(event);

  if (error) {
    throw new AppError(error.details?.[0]?.message || "Invalid event data", 400);
  }
};
