import { ReturnRequest } from "../../models/ReturnRequest.model.js";
import { Order } from "../../models/Order.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// 1. Get All Return Requests
export const getAllReturnRequests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = {};
  
  if (status) {
    filter.status = status;
  }

  const returns = await ReturnRequest.find(filter)
    .populate("userId", "fullName email")
    .populate("orderId", "orderId totalAmount")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await ReturnRequest.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, { returns, total, page: parseInt(page) }, "Return requests fetched successfully")
  );
});

// 2. Update Return Status (Approve/Reject)
export const updateReturnStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status. Use 'approved' or 'rejected'.");
  }

  const returnRequest = await ReturnRequest.findById(id);
  if (!returnRequest) {
    throw new ApiError(404, "Return request not found");
  }

  returnRequest.status = status;
  
  // If approved, update the Order status
  if (status === "approved") {
    await Order.findByIdAndUpdate(returnRequest.orderId, { 
      orderStatus: "returned" 
    });
  }

  await returnRequest.save();

  return res.status(200).json(
    new ApiResponse(200, returnRequest, `Return request ${status} successfully`)
  );
});