import "dotenv/config";
import { cleanEnv, port, str } from "envalid/dist";

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

  // Email configuration
  SMTP_HOST: str({ default: "smtp.gmail.com" }),
  SMTP_PORT: str({ default: "587" }),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  SMTP_FROM_NAME: str({ default: "Your App" }),
  SMTP_FROM_EMAIL: str(),
  SMTP_SECURE: str({ default: "false" }),
});
