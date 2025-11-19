import { config } from "dotenv";

config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL,
  DB_PASS: process.env.DB_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};
