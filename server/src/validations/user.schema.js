import Joi from "joi";

// Update Profile
export const updateUserProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/)
}).min(1);

// Address Management
export const addressSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  addressLine1: Joi.string().max(255).required(),
  addressLine2: Joi.string().max(255).allow(""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().default("India"),
  pincode: Joi.string().pattern(/^[0-9]{4,10}$/).required(),
  type: Joi.string().valid("Home", "Work", "Warehouse", "Pickup", "Return", "Other").default("Home"),
  isDefault: Joi.boolean()
});