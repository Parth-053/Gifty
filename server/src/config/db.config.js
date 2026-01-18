import mongoose from "mongoose";
import { logger } from "./logger.js";
import { envConfig } from "./env.config.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envConfig.mongoose.url, envConfig.mongoose.options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};