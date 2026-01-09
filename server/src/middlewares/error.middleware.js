import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";

/**
 * Global Error Handler Middleware
 * Catches all errors thrown in the app and sends a standardized JSON response.
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Check if the error is an instance of our custom ApiError
  // If not (e.g., Mongoose error), wrap it into ApiError for consistency
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error 
        ? httpStatus.BAD_REQUEST 
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = error.message || "Something went wrong";
    
    // Pass the original stack trace
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // 2. Prepare the response object
  const response = {
    ...error,
    message: error.message,
    statusCode: error.statusCode,
    success: false, // Errors are never successful
    // Only show stack trace in Development mode (Security Best Practice)
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  // 3. Send the response
  return res.status(error.statusCode).json(response);
};