import Joi from "joi";

// Helper for MongoDB ObjectId validation
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

// Common Password Rule: Min 6 chars, at least 1 number (optional strictly)
const passwordRule = Joi.string().min(6).required();

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: passwordRule,
  phone: Joi.string().pattern(/^[0-9]+$/).length(10).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: passwordRule.disallow(Joi.ref('oldPassword')).messages({
    "any.invalid": "New password cannot be same as old password"
  }),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^[0-9]+$/).length(10),
}).min(1); // At least one field must be provided