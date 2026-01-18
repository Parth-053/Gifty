import { updateProfile } from "../../services/user.service.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Get My Profile
 * @route   GET /api/v1/user/profile
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  // User is already attached to req by authMiddleware
  return res.status(200).json(new ApiResponse(200, req.user, "Profile fetched"));
});

/**
 * @desc    Update Profile Details & Avatar
 * @route   PUT /api/v1/user/profile
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  // req.file is provided by multer middleware if an image is uploaded
  const updatedUser = await updateProfile(req.user._id, req.body, req.file);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

/**
 * @desc    Deactivate Account
 * @route   DELETE /api/v1/user/profile
 */
export const deactivateAccount = asyncHandler(async (req, res) => {
  // Soft delete logic usually goes here
   await userService.deactivateUser(req.user._id);
  return res.status(200).json(new ApiResponse(200, {}, "Account deactivated"));
});