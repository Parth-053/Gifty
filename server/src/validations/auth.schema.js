import Joi from "joi";

export const syncUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow(""),
  avatar: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().allow(null, "")
  }).optional()
});

export const syncSellerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  storeName: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional().messages({
    'string.pattern.base': 'Invalid GSTIN format'
  })
});