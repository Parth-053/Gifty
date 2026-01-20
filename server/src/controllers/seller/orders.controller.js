import Order from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Get Seller Orders with Filtering & Pagination
 * @route   GET /api/v1/seller/orders
 */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
 
  const query = { "items.sellerId": req.user._id };
  if (status) query.orderStatus = status;

  const orders = await Order.find(query)
    .select("orderId items totalAmount orderStatus createdAt shippingAddress")
    .populate("userId", "fullName email phone") // User details for shipping
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);
 
  const sellerOrders = orders.map(order => {
    const myItems = order.items.filter(item => 
      item.sellerId.toString() === req.user._id.toString()
    );
    
    return {
      ...order.toObject(),
      items: myItems,
      sellerTotal: myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      orders: sellerOrders,
      pagination: { total, page, totalPages: Math.ceil(total / limit) }
    }, "Seller orders fetched")
  );
});

/**
 * @desc    Update Status of a specific item in an order
 * @route   PUT /api/v1/seller/orders/:orderId/item/:itemId
 */
export const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // e.g., 'shipped', 'packed'
  const { orderId, itemId } = req.params;

  const order = await Order.findOne({ 
    _id: orderId, 
    "items.sellerId": req.user._id 
  });

  if (!order) throw new ApiError(404, "Order not found or unauthorized");

  const item = order.items.id(itemId);
  if (!item) throw new ApiError(404, "Item not found");

  // Status Update
  item.status = status;
   
  await order.save();

  return res.status(200).json(new ApiResponse(200, order, `Item status updated to ${status}`));
});