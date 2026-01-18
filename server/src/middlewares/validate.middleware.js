import { ApiError } from "../utils/ApiError.js";

/**
 * Generic Validator Middleware
 * @param {Object} schema - Joi Schema Object
 * @param {String} source - 'body', 'query', or 'params'
 */
const validate = (schema, source = "body") => (req, res, next) => {
  // Select the part of request to validate
  const objectToValidate = req[source];

  // Joi validation options
  const options = {
    abortEarly: false, // Show all errors, not just the first one
    allowUnknown: true, // Allow extra fields (optional, set false for strict mode)
    stripUnknown: true, // Remove unknown fields
  };

  const { error, value } = schema.validate(objectToValidate, options);

  if (error) {
    // Collect all error messages
    const errorMessage = error.details
      .map((details) => details.message.replace(/"/g, ""))
      .join(", ");
    
    return next(new ApiError(400, `Validation Error: ${errorMessage}`));
  }

  // Replace req.body with validated (and cleaned) value
  req[source] = value;
  return next();
};

export default validate;