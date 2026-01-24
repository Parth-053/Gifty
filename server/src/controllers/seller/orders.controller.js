import { Order } from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Seller Orders (List)
 * @route   GET /api/v1/seller/orders
 */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;
  const baseQuery = { "items.sellerId": sellerId };
  
  const features = new ApiFeatures(
    Order.find(baseQuery).populate("userId", "fullName email phone avatar"),
    req.query
  )
  .filter()
  .sort()
  .paginate();

  const orders = await features.query;
  const total = await Order.countDocuments(baseQuery);

  // Transform: Filter items to show only this seller's products
  const sellerOrders = orders.map(order => {
    const myItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
    const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return {
      _id: order._id,
      orderId: order.orderId,
      createdAt: order.createdAt,
      user: order.userId,
      orderStatus: order.orderStatus, // Global status
      items: myItems,
      totalAmount: myTotal,
      paymentMethod: order.paymentMethod
    };
  });

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { orders: sellerOrders, total }, "Orders fetched"));
});

/**
 * @desc    Get Single Order Details
 * @route   GET /api/v1/seller/orders/:id
 */
export const getSellerOrderDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.seller._id;

  const order = await Order.findOne({ _id: id, "items.sellerId": sellerId })
    .populate("userId", "fullName email phone avatar")
    .populate("shippingAddress");

  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

  // Filter items for this seller
  const myItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
  const myTotal = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const orderData = {
    ...order.toObject(),
    items: myItems,
    totalAmount: myTotal
  };

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, orderData, "Order details fetched"));
});

/**
 * @desc    Update Item Status
 * @route   PATCH /api/v1/seller/orders/:orderId/items/:itemId
 */
export const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId, itemId } = req.params;
  const sellerId = req.seller._id;

  const order = await Order.findOne({ _id: orderId, "items.sellerId": sellerId });
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

  const item = order.items.id(itemId);
  if (!item || item.sellerId.toString() !== sellerId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized access to item");
  }

  item.status = status;
  
  // Optional: Check if all items are processed to update main orderStatus
  // Logic can be added here if needed

  await order.save();

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, order, "Item status updated"));
});