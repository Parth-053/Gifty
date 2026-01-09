import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";

/**
 * Middleware to validate request data against a Joi schema
 * @param {Object} schema - Joi schema object
 * @param {String} source - Property to validate ('body', 'query', 'params')
 */
const validate = (schema, source = "body") => (req, res, next) => {
  // 1. Select data to validate (body, query params, or URL params)
  const data = req[source];

  // 2. Validate using Joi
  // 'abortEarly: false' means return ALL errors, not just the first one
  // 'stripUnknown: true' means remove fields that are not in the schema (Security)
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    // 3. Extract error messages
    const errorMessage = error.details
      .map((details) => details.message.replace(/"/g, "")) // Remove quotes for cleaner msg
      .join(", ");

    // 4. Throw Error (Stop request here)
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  // 5. Replace req.body with validated (and cleaned) value
  Object.assign(req, value);
  
  return next();
};

export default validate;