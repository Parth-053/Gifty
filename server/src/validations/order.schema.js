import Joi from "joi";

const orderItemSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
  
  // Customization Data (Optional)
  customization: Joi.object({
    text: Joi.string().allow(""),
    color: Joi.string().allow(""),
    image: Joi.string().uri().allow("")
  }).optional()
});

export const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    addressLine1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
  }).required(),
  
  paymentMethod: Joi.string().valid("cod", "online").required()
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("placed", "processing", "shipped", "delivered", "cancelled").required()
});