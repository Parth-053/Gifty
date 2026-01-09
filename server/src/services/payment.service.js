import Razorpay from "razorpay";
import crypto from "crypto";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";

// Initialize Razorpay Instance
// Make sure these exist in your .env file
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Initialize Payment (Create Order in Razorpay)
 * @param {Number} amount - Amount in lowest denomination (paise for INR)
 * @param {String} receiptId - Your internal Order ID (e.g., order._id)
 * @returns {Promise<Object>} - Razorpay Order Object
 */
export const createPaymentIntent = async (amount, receiptId) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert Rupee to Paise (e.g., 500 => 50000)
      currency: "INR",
      receipt: receiptId.toString(),
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    return order;

  } catch (error) {
    console.error("Razorpay Error:", error);
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, "Unable to initialize payment gateway");
  }
};

/**
 * Verify Payment Signature (Security Check)
 * Compares the signature returned by frontend with the one generated on backend.
 * @param {Object} data - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Boolean} - True if valid
 */
export const verifyPaymentSignature = (data) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment verification failed: Missing data");
  }

  // Generate expected signature using HMAC SHA256
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payment signature. Potential fraud attempt.");
  }

  return true;
};

/**
 * Process Refund
 * @param {String} paymentId - The Razorpay Payment ID (e.g., pay_29383...)
 * @param {Number} amount - Amount to refund (optional, generic full refund if empty)
 */
export const processRefund = async (paymentId, amount = null) => {
  try {
    const options = {};
    if (amount) {
      options.amount = Math.round(amount * 100); // Amount in paise
    }

    const refund = await razorpay.payments.refund(paymentId, options);
    return refund;

  } catch (error) {
    console.error("Refund Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Refund processing failed");
  }
};

/**
 * Get Payment Details
 * Useful for admin dashboard to check transaction status
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment details not found");
  }
};