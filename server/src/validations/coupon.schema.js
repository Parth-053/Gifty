import Joi from "joi";

export const createCouponSchema = Joi.object({
  code: Joi.string().min(3).max(20).uppercase().trim().required(),
  description: Joi.string().max(200).allow("").optional(),
  discountType: Joi.string().valid("percentage", "fixed").required(),
  discountValue: Joi.number().min(1).required(),
  minPurchaseAmount: Joi.number().min(0).default(0),
  maxDiscountAmount: Joi.number().min(0).allow(null, "").optional(),
  startDate: Joi.date().default(Date.now),
  expirationDate: Joi.date().greater('now').required(),
  usageLimit: Joi.number().integer().min(1).default(100),
  isActive: Joi.boolean().default(true)
});

export const updateCouponSchema = Joi.object({
  code: Joi.string().min(3).max(20).uppercase().trim(),
  description: Joi.string().max(200).allow(""),
  discountType: Joi.string().valid("percentage", "fixed"),
  discountValue: Joi.number().min(1),
  minPurchaseAmount: Joi.number().min(0),
  maxDiscountAmount: Joi.number().min(0).allow(null, ""),
  startDate: Joi.date(),
  expirationDate: Joi.date().greater('now'),
  usageLimit: Joi.number().integer().min(1),
  isActive: Joi.boolean()
}).min(1);