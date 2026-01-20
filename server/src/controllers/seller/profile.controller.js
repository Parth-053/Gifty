import { Seller } from "../../models/seller.model.js";
import { User } from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Update Seller Personal Profile
 * @route   PUT /api/v1/seller/profile/me
 */
export const updateSellerProfile = asyncHandler(async (req, res) => {
  const { fullName, phone } = req.body;

  // 1. Update User model (Main identity)
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: fullName } },
    { new: true }
  );

  // 2. Update Seller model
  const updatedSeller = await Seller.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { fullName, phone } },
    { new: true }
  );

  if (!updatedSeller) {
    throw new ApiError(404, "Seller profile not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedSeller, "Profile updated successfully")
  );
});

/**
 * @desc    Update Store Settings (Logo, Description, Vacation Mode)
 * @route   PUT /api/v1/seller/profile/store
 */ 
export const updateStoreSettings = asyncHandler(async (req, res) => {
  const { storeName, description, vacationMode } = req.body;

  const updatedStore = await Seller.findOneAndUpdate(
    { userId: req.user._id },
    { 
      $set: { 
        storeName, 
        description, 
        vacationMode: vacationMode ?? false 
      } 
    },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedStore, "Store settings saved successfully")
  );
});

/**
 * @desc    Update Bank Details (KYC)
 * @route   PUT /api/v1/seller/profile/bank
 */
export const updateBankDetails = asyncHandler(async (req, res) => {
  const { bankDetails } = req.body;

  const seller = await Seller.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { bankDetails } },
    { new: true, select: "+bankDetails" }
  );

  return res.status(200).json(
    new ApiResponse(200, seller.bankDetails, "Bank details updated")
  );
});

/**
 * @desc    Get Seller Profile Data
 * @route   GET /api/v1/seller/profile/me
 */
export const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({ userId: req.user._id })
    .populate("userId", "name email role");

  if (!seller) {
    throw new ApiError(404, "Profile not found");
  }

  return res.status(200).json(
    new ApiResponse(200, seller, "Seller profile fetched")
  );
});