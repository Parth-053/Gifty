import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  cancelOrder,
  updateOrderStatus 
} from "../../services/order.service.js";
import { 
  createPaymentIntent, 
  verifyPaymentSignature 
} from "../../services/payment.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import { httpStatus, PaymentMethod, OrderStatus, PaymentStatus } from "../../utils/constants.js";

/**
 * @desc    Checkout (Create Order)
 * @route   POST /api/v1/orders/checkout
 */
export const checkout = asyncHandler(async (req, res) => {
  const { addressId, paymentMethod } = req.body;

  // 1. Create Order (Stock Reserved)
  const order = await createOrder(req.user._id, { addressId, paymentMethod });

  // 2. If Online Payment -> Init Razorpay
  if (paymentMethod === PaymentMethod.ONLINE) {
    const razorpayOrder = await createPaymentIntent(order.totalAmount, order._id);

    return res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, {
        order,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }, "Order created, proceed to payment")
    );
  }

  // If COD
  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, { order }, "Order placed successfully"));
});

/**
 * @desc    Verify Payment (Razorpay Callback)
 * @route   POST /api/v1/orders/verify-payment
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // 1. Verify Signature
  verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

  // 2. Mark Order as PAID
  // Direct DB update here because service is generic
  const order = await updateOrderStatus(orderId, OrderStatus.PLACED); // Confirm status
  order.paymentStatus = PaymentStatus.PAID;
  order.paymentMethod = PaymentMethod.ONLINE;
  await order.save();

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, order, "Payment successful"));
});

/**
 * @desc    Get My Orders
 * @route   GET /api/v1/orders
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const result = await getUserOrders(req.user._id, req.query);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, result, "Orders fetched"));
});

/**
 * @desc    Get Order Details
 * @route   GET /api/v1/orders/:orderId
 */
export const getOrderDetails = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.orderId, req.user._id);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, order, "Order details fetched"));
});

/**
 * @desc    Cancel Order
 * @route   POST /api/v1/orders/:orderId/cancel
 */
export const cancelMyOrder = asyncHandler(async (req, res) => {
  await cancelOrder(req.params.orderId, req.user._id);
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, "Order cancelled"));
});