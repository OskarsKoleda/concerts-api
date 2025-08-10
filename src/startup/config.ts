import config from "config";

export const setConfig = (): void => {
  if (!config.get("db")) {
    console.error("FATAL ERROR: db not provided");
    process.exit(1);
  }
};
