import * as paymentService from "../../services/payment.service.js";
import Order from "../../models/Order.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Initialize Payment
 * @route   POST /api/v1/payment/create-order
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body; // Internal Order ID 

  const order = await Order.findOne({ orderId, userId: req.user._id });
  if (!order) throw new ApiError(404, "Order not found");

  const paymentOrder = await paymentService.createPaymentOrder(orderId, order.totalAmount);

  return res.status(200).json(new ApiResponse(200, paymentOrder, "Payment order created"));
});

/**
 * @desc    Verify & Capture Payment
 * @route   POST /api/v1/payment/verify
 */
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const result = await paymentService.processPaymentSuccess(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, result, "Payment successful"));
});