import { Seller } from "../../models/Seller.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
//import { ApiError } from "../../utils/ApiError.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Seller Profile
 * @route   GET /api/v1/seller/profile
 */
export const getSellerProfile = asyncHandler(async (req, res) => {
  // req.seller is already attached by auth middleware
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, req.seller, "Seller profile fetched"));
});

/**
 * @desc    Update Seller Profile (Personal Info)
 * @route   PATCH /api/v1/seller/profile
 */
export const updateSellerProfile = asyncHandler(async (req, res) => {
  const { fullName, phone } = req.body;

  const updatedSeller = await Seller.findByIdAndUpdate(
    req.seller._id,
    { fullName, phone },
    { new: true, runValidators: true }
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedSeller, "Profile updated successfully"));
});

/**
 * @desc    Update Store Settings
 * @route   PATCH /api/v1/seller/store
 */
export const updateStoreSettings = asyncHandler(async (req, res) => {
  const { storeName, storeDescription, isOpen } = req.body;

  const updatedSeller = await Seller.findByIdAndUpdate(
    req.seller._id,
    { 
      storeName, 
      storeDescription, 
      isOpen // Vacation Mode
    },
    { new: true, runValidators: true }
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedSeller, "Store settings updated"));
});

/**
 * @desc    Update Bank Details
 * @route   PATCH /api/v1/seller/bank
 */
export const updateBankDetails = asyncHandler(async (req, res) => {
  const { bankDetails } = req.body;

  const updatedSeller = await Seller.findByIdAndUpdate(
    req.seller._id,
    { bankDetails },
    { new: true, runValidators: true }
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedSeller, "Bank details updated"));
});