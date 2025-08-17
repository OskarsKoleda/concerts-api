import { EventCreationFields } from "../models/event/event.types";

export const normalizeEventInput = (event: EventCreationFields) => {
  if (typeof event.bands === "string") {
    event.bands = (event.bands as string).split(",");
  }

  return event;
};
