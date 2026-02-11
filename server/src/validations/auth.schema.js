import Joi from "joi";

export const syncUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow("", null),
  avatar: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().allow(null, "")
  }).optional().allow(null),
  addressData: Joi.any().optional() 
});

export const syncSellerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  storeName: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  
  // Allow empty string OR null for optional GSTIN
  gstin: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow("", null) 
    .messages({
      'string.pattern.base': 'Invalid GSTIN format'
    }),
    
  email: Joi.string().email().optional(), 
  role: Joi.string().optional()
});