import { Order } from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Seller Orders
 * @route   GET /api/v1/seller/orders
 */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;

  // 1. Initial Filter: Find orders that CONTAIN seller's items
  const baseQuery = { "items.sellerId": sellerId };
  
  // 2. Use ApiFeatures for Pagination/Sorting on the main Order document
  const features = new ApiFeatures(
    Order.find(baseQuery).populate("userId", "fullName email phone"),
    req.query
  )
  .filter()
  .sort()
  .paginate();

  const orders = await features.query;
  const total = await Order.countDocuments(baseQuery);

  // 3. Transform Data: Filter items inside the order
  // Seller should NOT see items from other sellers in the same order
  const sellerOrders = orders.map(order => {
    const myItems = order.items.filter(item => 
      item.sellerId.toString() === sellerId.toString()
    );
    
    const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return {
      _id: order._id,
      orderId: order.orderId,
      createdAt: order.createdAt,
      user: order.userId,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus, // Global status
      items: myItems, // ONLY seller's items
      totalAmount: myTotal // ONLY seller's share
    };
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { orders: sellerOrders, total }, "Orders fetched successfully"));
});

/**
 * @desc    Update Item Status (e.g. Shipped/Packed)
 * @route   PATCH /api/v1/seller/orders/:orderId/items/:itemId
 */
export const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId, itemId } = req.params;
  const sellerId = req.seller._id;

  const order = await Order.findOne({ _id: orderId, "items.sellerId": sellerId });
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

  // Find the specific item
  const item = order.items.id(itemId);
  
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in order");
  }

  // Security Check
  if (item.sellerId.toString() !== sellerId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized to update this item");
  }

  item.status = status;
  await order.save();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, order, "Item status updated"));
});