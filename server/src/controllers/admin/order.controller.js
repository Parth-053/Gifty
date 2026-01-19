import  Order from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// 1. Get All Orders (With Pagination & Filters)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  // Build Query
  const query = {};
  
  if (status && status !== "All") {
    query.status = status;
  }

  if (search) {
    query._id = search; 
  }

  const orders = await Order.find(query)
    .populate("userId", "name email")  
    .sort({ createdAt: -1 }) 
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalOrders = await Order.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, { orders, totalOrders, currentPage: page }, "All orders fetched successfully")
  );
});

export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, order, `Order status updated to ${status}`)
  );
});