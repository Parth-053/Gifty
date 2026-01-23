import Joi from "joi";

// Update Seller Profile
export const updateSellerProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(100),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  storeName: Joi.string().min(3).max(100),
  gstin: Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
  
  businessAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string()
  }),
  
  bankDetails: Joi.object({
    accountNumber: Joi.string().min(9).max(18).required(),
    ifscCode: Joi.string().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).required(),
    bankName: Joi.string().required(),
    accountName: Joi.string().required()
  })
}).min(1);

// Update Store Settings
export const updateStoreSettingsSchema = Joi.object({
  storeDescription: Joi.string().max(500).allow(""),
  isOpen: Joi.boolean() 
});