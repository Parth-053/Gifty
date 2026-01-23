import { ApiError } from "../utils/ApiError.js";
import { logger } from "../config/logger.js";
import { envConfig } from "../config/env.config.js";

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. If error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], error.stack);
  }

  // 2. Log the Error
  logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (envConfig.env === "development") {
    logger.error(error.stack);
  }

  // 3. Send Response
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(envConfig.env === "development" && { stack: error.stack }) // Show stack only in dev
  };

  return res.status(error.statusCode).json(response);
};