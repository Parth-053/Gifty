import Joi from "joi";

// Existing Schema (Login/Register ke liye)
export const syncUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow(""),
  avatar: Joi.object({
    url: Joi.string().uri().required(),
    publicId: Joi.string().allow(null, "")
  }).optional()
});

// Existing Schema (Seller Registration ke liye)
export const syncSellerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  storeName: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  
  gstin: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow("") 
    .messages({
      'string.pattern.base': 'Invalid GSTIN format'
    })
});

// ✅ NEW SCHEMA: Add this for Profile Update / Onboarding
export const updateSellerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).optional(),  // Update me ye optional hona chahiye
  storeName: Joi.string().min(3).max(100).optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  
  gstin: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .optional()
    .allow("")
    .messages({ 'string.pattern.base': 'Invalid GSTIN format' }),

  // Address Object Validation
  address: Joi.object({
    street: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    state: Joi.string().allow("").optional(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).allow("").optional(),
    country: Joi.string().default("India").optional()
  }).optional(),

  // Bank Details Validation
  bankDetails: Joi.object({
    accountHolderName: Joi.string().allow("").optional(),
    accountNumber: Joi.string().allow("").optional(),
    ifscCode: Joi.string().allow("").optional(),
    bankName: Joi.string().allow("").optional(),
  }).optional()
});