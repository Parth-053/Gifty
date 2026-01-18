import Razorpay from "razorpay";
import crypto from "crypto";
import { envConfig } from "../config/env.config.js";
import { ApiError } from "../utils/apiError.js";
import { Transaction } from "../models/Transaction.model.js";
import Order from "../models/Order.model.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: envConfig.payment.razorpayId, 
  key_secret: envConfig.payment.razorpaySecret,
});

/**
 * Create Payment Order (Razorpay)
 */
export const createPaymentOrder = async (orderId, amount) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Amount in smallest currency unit (paise)
      currency: "INR",
      receipt: orderId, // Our internal Order ID
      payment_capture: 1 // Auto capture
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new ApiError(500, "Razorpay Error: " + error.message);
  }
};

/**
 * Verify Payment Signature
 */
export const verifyPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", envConfig.payment.razorpaySecret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

/**
 * Process Successful Payment
 */
export const processPaymentSuccess = async (userId, paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = paymentData;

  // 1. Verify Signature
  const isValid = await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) throw new ApiError(400, "Invalid Payment Signature");

  // 2. Find Order
  const order = await Order.findOne({ orderId });
  if (!order) throw new ApiError(404, "Order not found");

  // 3. Update Order Status
  order.paymentInfo = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    status: "paid"
  };
  order.orderStatus = "processing"; // Move from 'placed' to 'processing'
  await order.save();

  // 4. Record Transaction
  await Transaction.create({
    orderId: order._id,
    userId,
    paymentMethod: "razorpay",
    paymentGatewayId: razorpay_payment_id,
    amount: order.totalAmount,
    status: "success"
  });

  return order;
};