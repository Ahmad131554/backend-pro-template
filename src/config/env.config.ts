import "dotenv/config";
import { cleanEnv, port, str, url } from "envalid/dist";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  PORT: port({ default: 8003 }),

  // If your Mongo string isn't a strict URL per envalid, use str() instead.
  MONGO_URI: str(),

  JWT_SECRET: str(),
  JWT_RESET_SECRET: str(),
});
