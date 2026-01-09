/**
 * asyncHandler
 * Wraps async controller functions to handle errors automatically.
 * Instead of try-catch in every controller, just wrap the function with this.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((err) => next(err)); // Pass error to global error handler
  };
};

export { asyncHandler };