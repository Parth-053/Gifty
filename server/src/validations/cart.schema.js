import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).max(50).default(1),
  
  // Customization (Must match Order Logic)
  customizationDetails: Joi.array().items(
    Joi.object({
      optionName: Joi.string().required(),
      type: Joi.string().valid('text', 'image', 'color').default('text'),
      value: Joi.string().required()
    })
  ).optional()
});

export const updateCartItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).max(50).required()
});