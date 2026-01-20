import Joi from "joi";

// 1. Auth Registration Schema
export const registerSellerSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).trim().required().messages({
    'string.empty': 'Full name is required',  
    'string.min': 'Full name should have at least 3 characters'
  }),
  storeName: Joi.string().min(3).max(50).trim().required(),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits'
  }),
  gstin: Joi.string().allow('', null).pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .messages({
      'string.pattern.base': 'Invalid GSTIN Format'
    }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long'
  })
});

// 2. Onboarding/Bank Details Schema
export const sellerOnboardingSchema = Joi.object({
  bankDetails: Joi.object({
    accountNumber: Joi.string().min(9).max(18).required(),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required().messages({
      'string.pattern.base': 'Invalid IFSC Code Format'
    }),
    bankName: Joi.string().required(),
    accountName: Joi.string().required() 
  }).required()
});

// 3. Profile Update Schema
export const updateSellerProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).trim(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  storeName: Joi.string().min(3).max(50).trim(),
  description: Joi.string().max(500).allow(""),
  currentPassword: Joi.string().min(8),
  newPassword: Joi.string().min(8)
});

// 4. Store Settings Schema
export const updateStoreSettingsSchema = Joi.object({
  storeName: Joi.string().min(3).max(50).trim(),
  description: Joi.string().max(500).allow(""),
  vacationMode: Joi.boolean()
});