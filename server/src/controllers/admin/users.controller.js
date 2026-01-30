import { User } from "../../models/User.model.js";
import { Seller } from "../../models/Seller.model.js";  
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { httpStatus } from "../../constants/httpStatus.js";

// --- User Management ---

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, users, "Users fetched"));
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user, "User details fetched"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'active' or 'blocked'
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: status === 'active' }, { new: true });
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, user, "User status updated"));
});

// --- Seller Management (Added these functions) ---

export const getAllSellers = asyncHandler(async (req, res) => {
  // Fetch all sellers who are NOT pending (Approved, Rejected, Suspended)
  const sellers = await Seller.find({ status: { $ne: "pending" } })
    .select("-firebaseUid")
    .sort({ createdAt: -1 });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, sellers, "Sellers fetched successfully"));
});

export const getSellerDetails = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller not found");
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, seller, "Seller details fetched"));
});