import * as orderService from "../../services/order.service.js"; 
import Order from "../../models/Order.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * @desc    Create New Order
 * @route   POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  // Call the complex service logic for stock deduction & price checks
  const order = await orderService.createOrder(req.user._id, {
    items,
    address: shippingAddress,
    paymentMethod,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

/**
 * @desc    Get All Orders for Logged-in User
 * @route   GET /api/v1/orders
 */
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .select("orderId totalAmount orderStatus createdAt items")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

/**
 * @desc    Get Single Order Details
 * @route   GET /api/v1/orders/:id
 */
export const getOrderDetails = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  // Find order by ID AND ensure it belongs to the logged-in user
  const order = await Order.findOne({ 
    _id: orderId, 
    userId: req.user._id 
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully"));
});