import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { envConfig } from "../config/env.config.js";
import { logger } from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Convert Non-ApiError to ApiError (Standardization)
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], error.stack);
  }

  // 2. Prepare Response
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(envConfig.env === "development" && { stack: error.stack }), // Show stack only in Dev
    errors: error.errors || [],
  };

  // 3. Log Error (Critical for debugging)
  if (envConfig.env === "development") {
    logger.error(`❌ ${error.message}`);
  }

  return res.status(error.statusCode).json(response);
};

export { errorHandler };