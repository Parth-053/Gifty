import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import Seller from "../../models/seller.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus, OrderStatus } from "../../utils/constants.js";

// Helper
const getSellerId = async (userId) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new ApiError(httpStatus.FORBIDDEN, "Seller profile not found");
  return seller._id;
};

/**
 * @desc    Get Orders Containing My Products
 * @route   GET /api/v1/sellers/orders
 */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);
  const { page = 1, limit = 10, status } = req.query;

  // 1. Find my products
  const myProducts = await Product.find({ sellerId }).select("_id");
  const myProductIds = myProducts.map(p => p._id);

  if (myProductIds.length === 0) {
    return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, [], "No products, no orders"));
  }

  // 2. Query Orders
  const filter = { "items.productId": { $in: myProductIds } };
  if (status) filter.orderStatus = status;

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("addressId", "city state pincode") // Only show non-sensitive address info
    .lean();

  const total = await Order.countDocuments(filter);

  // 3. Filter Items (Privacy: Only show MY items in the order)
  const sanitizedOrders = orders.map(order => {
    const myItems = order.items.filter(item => 
      myProductIds.some(id => id.toString() === item.productId.toString())
    );
    return {
      _id: order._id,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      address: order.addressSnapshot || order.addressId, // Use snapshot if available
      items: myItems, // 🔥 Only my items
      myTotalRevenue: myItems.reduce((sum, i) => sum + (i.priceSnapshot * i.quantity), 0)
    };
  });

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {
    orders: sanitizedOrders,
    meta: { total, page: Number(page) }
  }, "Orders fetched"));
});

/**
 * @desc    Update Order Status
 * @route   PATCH /api/v1/sellers/orders/:orderId/status
 */
export const updateOrderProcessStatus = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);
  const { status } = req.body;
  const { orderId } = req.params;

  // Check valid status flow
  if (![OrderStatus.PACKED, OrderStatus.SHIPPED, OrderStatus.DELIVERED].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status update");
  }

  // Verify this order belongs to seller
  const myProducts = await Product.find({ sellerId }).select("_id");
  const myProductIds = myProducts.map(p => p._id);

  const order = await Order.findOne({
    _id: orderId,
    "items.productId": { $in: myProductIds }
  });

  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

  // Update Status
  order.orderStatus = status;
  await order.save();

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, order, `Order marked as ${status}`));
});