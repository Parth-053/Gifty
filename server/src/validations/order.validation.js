import Joi from "joi";
import { PaymentMethod, OrderStatus } from "../utils/constants.js";

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

export const checkoutSchema = Joi.object({
  addressId: Joi.string().custom(objectId).required(),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod)) // "cod" or "online"
    .required()
});

export const verifyPaymentSchema = Joi.object({
  orderId: Joi.string().custom(objectId).required(),
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required()
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus)) // placed, packed, shipped...
    .required()
});