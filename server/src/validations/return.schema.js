import Joi from "joi";

export const createReturnRequestSchema = Joi.object({
  orderId: Joi.string().hex().length(24).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().hex().length(24).required(),
      quantity: Joi.number().integer().min(1).required(),
      reason: Joi.string().min(5).max(500).required(),
      images: Joi.array().items(Joi.string().uri()).optional() // Proof Images
    })
  ).min(1).required()
});