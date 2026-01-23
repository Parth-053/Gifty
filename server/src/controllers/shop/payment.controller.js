import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as paymentService from "../../services/payment.service.js";
import * as orderService from "../../services/order.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Initialize Payment (Create Razorpay Order)
 * @route   POST /api/v1/shop/payment/create-order
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body; 

  // 1. Fetch Order to get exact amount
  const order = await orderService.getOrderById(orderId);
  
  // Security: Ensure user owns this order
  if (order.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized access to order");
  }

  // 2. Create Gateway Order
  const paymentOrder = await paymentService.createPaymentOrder(order.orderId, order.totalAmount);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, paymentOrder, "Payment initiated"));
});

/**
 * @desc    Verify Payment & Capture
 * @route   POST /api/v1/shop/payment/verify
 */
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  // Expects: { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }
  const result = await paymentService.processPaymentSuccess(req.user._id, req.body);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, result, "Payment verified successfully"));
});