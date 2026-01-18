import Joi from "joi";

export const sellerOnboardingSchema = Joi.object({
  storeName: Joi.string().min(3).max(50).trim().required(),
  description: Joi.string().max(500).allow(""),
  
  gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).message("Invalid GSTIN Format"),
  panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).message("Invalid PAN Format"),
  
  bankDetails: Joi.object({
    accountNumber: Joi.string().min(9).max(18).required(),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required(),
    beneficiaryName: Joi.string().required()
  }).required()
});

export const updateSellerProfileSchema = Joi.object({
  storeName: Joi.string().min(3).max(50).trim(),
  description: Joi.string().max(500),
  bankDetails: Joi.object({
    accountNumber: Joi.string(),
    ifscCode: Joi.string(),
    beneficiaryName: Joi.string()
  })
});