import { Order } from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Orders (Admin)
 * @route   GET /api/v1/admin/orders
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  // Use ApiFeatures for automatic sort, filter, paginate
  const features = new ApiFeatures(Order.find().populate("userId", "fullName email"), req.query)
    .filter()
    .sort()
    .paginate();

  const orders = await features.query;
  const totalOrders = await Order.countDocuments(); // Should ideally match filter

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { orders, totalOrders }, "Orders fetched successfully")
  );
});

/**
 * @desc    Update Order Status (Admin Override)
 * @route   PATCH /api/v1/admin/orders/:id/status
 */
export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: status },
    { new: true }
  );

  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, order, "Order status updated"));
});