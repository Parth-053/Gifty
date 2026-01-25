import { Seller } from "../../models/Seller.model.js";
import { ApiError } from "../../utils/ApiError.js";
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

// Update Profile (Handles Onboarding)
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  const sellerId = req.seller._id;

  // Prevent updating sensitive fields directly
  delete updates.email;
  delete updates.firebaseUid;
  delete updates.isVerified;
  delete updates.role;

  // Check if onboarding is happening
  let isOnboarding = false;
  if (updates.address && updates.bankDetails && updates.gstin) {
      isOnboarding = true;
  }

  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    { 
      $set: {
        ...updates,
        onboardingCompleted: isOnboarding ? true : undefined // Only set true if all fields present, else keep existing
      }
    },
    { new: true, runValidators: true }
  );

  if (!updatedSeller) {
    throw new ApiError(404, "Seller not found");
  }

  // Force onboardingCompleted = true if fields exist (Double check)
  if (updatedSeller.address?.city && updatedSeller.bankDetails?.accountNumber && updatedSeller.gstin) {
      updatedSeller.onboardingCompleted = true;
      await updatedSeller.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSeller, "Profile updated successfully"));
});