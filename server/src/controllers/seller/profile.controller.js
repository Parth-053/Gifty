import { Seller } from "../../models/Seller.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Get Profile
export const getProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.seller._id);
  if (!seller) throw new ApiError(404, "Seller not found");

  return res
    .status(200)
    .json(new ApiResponse(200, seller, "Profile fetched successfully"));
});

// Update Profile (Handles Onboarding Steps)
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const sellerId = req.seller._id;

  // 1. Prevent updating sensitive auth fields via this route
  delete updates.email;
  delete updates.firebaseUid;
  delete updates.isVerified; // Admin controlled
  delete updates.role;
  delete updates.status; // Admin controlled

  // 2. Perform the update
  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedSeller) {
    throw new ApiError(404, "Seller not found");
  }

  // 3. Check for Onboarding Completion
  // We check if specific critical fields are now present in the database
  const hasAddress = 
    updatedSeller.address?.street && 
    updatedSeller.address?.city && 
    updatedSeller.address?.state && 
    updatedSeller.address?.pincode;

  const hasBank = 
    updatedSeller.bankDetails?.accountNumber && 
    updatedSeller.bankDetails?.ifscCode && 
    updatedSeller.bankDetails?.accountHolderName;

  // We consider onboarding complete if Address and Bank details are filled.
  // GSTIN might be optional depending on your business logic, but usually required for sellers.
  if (hasAddress && hasBank && !updatedSeller.onboardingCompleted) {
      updatedSeller.onboardingCompleted = true;
      await updatedSeller.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeller, "Profile updated successfully"));
});