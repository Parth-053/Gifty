import Joi from "joi";


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