import Joi from "joi";

// Re-export for consistency
export const syncSellerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  storeName: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  
  gstin: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow("", null)
    .messages({
      'string.pattern.base': 'Invalid GSTIN format'
    })
});

// PROFILE SCHEMA
export const updateSellerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),
  storeName: Joi.string().min(3).max(100).optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow("", null),
  
  gstin: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow("", null),

  // Address Object Validation
  address: Joi.object({
    street: Joi.string().optional().allow("", null),
    city: Joi.string().optional().allow("", null),
    state: Joi.string().optional().allow("", null),
    pincode: Joi.string().optional().allow("", null),
    country: Joi.string().default("India")
  }).optional(),

  // Bank Details Validation
  bankDetails: Joi.object({
    accountHolderName: Joi.string().optional().allow("", null),
    accountNumber: Joi.string().optional().allow("", null),
    ifscCode: Joi.string().optional().allow("", null),
    bankName: Joi.string().optional().allow("", null)
  }).optional()
});