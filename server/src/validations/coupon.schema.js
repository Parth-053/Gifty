import Joi from "joi";

export const createCouponSchema = Joi.object({
  code: Joi.string().min(3).max(20).uppercase().trim().required(),
  description: Joi.string().max(200).required(),
  
  discountType: Joi.string().valid("percentage", "fixed").required(),
  discountValue: Joi.number().min(1).required(),
  
  // Rules
  minPurchaseAmount: Joi.number().min(0).default(0),
  maxDiscountAmount: Joi.number().min(0).when('discountType', {
    is: 'percentage',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  
  startDate: Joi.date().default(Date.now),
  expirationDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
    'date.greater': 'Expiration date must be after start date'
  }),
  
  usageLimit: Joi.number().integer().min(1).default(100)
});