import morgan from "morgan";
import { logger } from "../config/logger.js";
import { envConfig } from "../config/env.config.js";

// Custom format for Morgan
const morganFormat = envConfig.env === "development" 
  ? "dev" 
  : ":remote-addr - :method :url :status :response-time ms - :res[content-length] :user-agent";

// Stream logic: Send Morgan logs to Winston
const stream = {
  write: (message) => {
    // Remove newline character from the end
    logger.info(message.trim());
  },
};

// Middleware Factory
export const requestLogger = morgan(morganFormat, { stream });