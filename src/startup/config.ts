import config from "config";

export const setConfig = (): void => {
  if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey not provided");
    process.exit(1);
  }
};
