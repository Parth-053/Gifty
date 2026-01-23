import { ReturnRequest } from "../../models/ReturnRequest.model.js";
import { Order } from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as imageService from "../../services/image.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Create Return Request
 * @route   POST /api/v1/user/returns
 */
export const requestReturn = asyncHandler(async (req, res) => {
  const { orderId, items, reason } = req.body; // items: [{ productId, quantity }]

  // 1. Verify Order
  const order = await Order.findOne({ _id: orderId, userId: req.user._id });
  if (!order) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

  if (order.orderStatus !== "delivered") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Only delivered orders can be returned");
  }

  // 2. Handle Proof Images
  let proofImages = [];
  if (req.files && req.files.length > 0) {
    proofImages = await imageService.uploadImages(req.files, "returns");
  }

  // 3. Create Request
  const returnRequest = await ReturnRequest.create({
    orderId,
    userId: req.user._id,
    items: items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      reason: reason,
      images: proofImages
    })),
    status: "Pending",
    refundAmount: 0 // Will be calculated by Admin upon approval
  });

  // 4. Update Order Status
  order.orderStatus = "returned"; // Or separate 'return_requested' status
  await order.save();

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, returnRequest, "Return request submitted"));
});

/**
 * @desc    Get My Returns
 * @route   GET /api/v1/user/returns
 */
export const getMyReturns = asyncHandler(async (req, res) => {
  const returns = await ReturnRequest.find({ userId: req.user._id })
    .populate("orderId", "orderId totalAmount")
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, returns, "Return history fetched"));
});