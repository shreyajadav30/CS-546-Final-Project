import dotenv from "dotenv";

dotenv.config();

export const mongoConfig = {
  serverUrl: process.env.MONGODB_URI,
  database: process.env.DB_NAME,
};
