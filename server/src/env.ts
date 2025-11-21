import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env");
}

export const ENV = {
  PORT: process.env.PORT || "4000",
  JWT_SECRET: process.env.JWT_SECRET as string,
};