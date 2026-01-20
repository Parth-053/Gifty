import Joi from "joi";

// Reusable Password Rule
const passwordRule = Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])"))
  .required()
  .messages({
    "string.pattern.base": "Password must contain at least one uppercase, one lowercase, one number and one special character",
    "string.min": "Password must be at least 8 characters long"
  });

export const registerSchema = Joi.object({ 
  fullName: Joi.string().min(2).max(50).trim().required(), 
  email: Joi.string().email().required(),
  password: passwordRule,
  role: Joi.string().valid("user", "seller").default("user"),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required() // Don't enforce regex on login, just check presence
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: passwordRule
});