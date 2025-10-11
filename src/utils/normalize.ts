import { CreateEventInput } from "../models/event/event.types";

export const normalizeEventInput = (event: Partial<CreateEventInput>) => {
  if (typeof event.bands === "string") {
    event.bands = (event.bands as string).split(",");
  }

  return event;
};
