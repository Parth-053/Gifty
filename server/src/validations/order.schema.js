import Joi from "joi";

// Validate Individual Order Item
const orderItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
  
  // FIXED: Matches new Dynamic Array structure
  customizationDetails: Joi.array().items(
    Joi.object({
      optionName: Joi.string().required(), 
      type: Joi.string().valid('text', 'image', 'color').default('text'),
      value: Joi.string().required() 
    })
  ).optional()
});

export const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    addressLine1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required()
  }).required(),
  
  paymentMethod: Joi.string().valid("cod", "online").required()
});