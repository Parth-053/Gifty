import Order from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Get Seller Orders
 * @route   GET /api/v1/seller/orders
 */
export const getSellerOrders = asyncHandler(async (req, res) => {
  // Find orders where at least one item belongs to this seller
  const orders = await Order.find({
    "items.sellerId": req.user._id
  })
  .select("orderId items totalAmount orderStatus createdAt shippingAddress")
  .sort({ createdAt: -1 });

  // Filter items inside the order to show ONLY seller's products
  const sellerOrders = orders.map(order => {
    const myItems = order.items.filter(item => 
      item.sellerId.toString() === req.user._id.toString()
    );
    
    return {
      ...order.toObject(),
      items: myItems, // Only show my items
      // Recalculate total for this seller only (optional, logical display)
      sellerTotal: myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    };
  });

  return res.status(200).json(new ApiResponse(200, sellerOrders, "Seller orders fetched"));
});

/**
 * @desc    Update Order Status (e.g. Shipped)
 * @route   PUT /api/v1/seller/orders/:orderId/item/:itemId
 */
export const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // e.g., 'shipped', 'packed'
  const { orderId, itemId } = req.params;

  const order = await Order.findOne({ 
    _id: orderId, 
    "items.sellerId": req.user._id 
  });

  if (!order) throw new ApiError(404, "Order not found");

  // Find the specific item
  const item = order.items.id(itemId);
  if (!item) throw new ApiError(404, "Item not found");

  if (item.sellerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this item");
  }

  item.status = status;
  await order.save();

  return res.status(200).json(new ApiResponse(200, order, "Item status updated"));
});