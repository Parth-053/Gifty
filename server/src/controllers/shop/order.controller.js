import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as orderService from "../../services/order.service.js";
import { notifyAdmin } from "../../services/notification.service.js"; // <--- IMPORT NOTIFICATION SERVICE
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Create Order
 * @route   POST /api/v1/user/orders
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  const order = await orderService.createOrder(req.user._id, {
    items,
    shippingAddress,
    paymentMethod,
  });

  // --- NOTIFICATION TRIGGER (NEW) ---
  // Notify Admin about the new order
  await notifyAdmin({
    type: "ORDER",
    title: "New Order Received",
    message: `Order #${order.orderId || order._id} placed by ${req.user.fullName || 'User'} for ₹${order.totalAmount}`,
    data: { 
      orderId: order._id, 
      amount: order.totalAmount,
      userId: req.user._id
    }
  });
  // ----------------------------------

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, order, "Order placed successfully"));
});

/**
 * @desc    Get My Orders
 * @route   GET /api/v1/user/orders
 */
export const getUserOrders = asyncHandler(async (req, res) => {
  // Service handles pagination logic
  const { orders, total } = await orderService.getUserOrders(req.user._id, req.query);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { orders, total }, "Orders fetched successfully"));
});

/**
 * @desc    Get Order Details
 * @route   GET /api/v1/user/orders/:id
 */
export const getOrderDetails = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  // Security Check: Ensure order belongs to user
  if (order.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to view this order");
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, order, "Order details fetched successfully"));
});