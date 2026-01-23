import crypto from "crypto";
import { razorpay } from "../config/payment.js";
import { envConfig } from "../config/env.config.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/Order.model.js";
import { Transaction } from "../models/Transaction.model.js"; 
import { generateTransactionId } from "../utils/helpers.js";

/**
 * Create Razorpay Order
 */
export const createPaymentOrder = async (orderId, amount) => {
  try {
    const options = {
      amount: Math.round(amount * 100),  
      currency: "INR",
      receipt: orderId.toString()
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new ApiError(500, "Payment Gateway Error: " + error.message);
  }
};

/**
 * Verify & Process Payment
 */
export const processPaymentSuccess = async (userId, paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = paymentData;

  // 1. Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", envConfig.razorpay.keySecret)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid Payment Signature");
  }

  // 2. Find Order
  const order = await Order.findOne({ _id: orderId });
  if (!order) throw new ApiError(404, "Order not found");

  // 3. Update Order
  order.paymentInfo = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    status: "paid"
  };
  order.orderStatus = "processing";  
  await order.save();

  // 4. Create Transaction Record (Audit Trail)
  await Transaction.create({
    transactionId: generateTransactionId(),  
    userId,
    orderId: order._id,
    paymentId: razorpay_payment_id,
    amount: order.totalAmount,
    status: "success",
    type: "credit", 
    gateway: "razorpay"
  });

  return order;
};