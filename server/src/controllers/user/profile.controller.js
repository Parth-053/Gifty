import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as userService from "../../services/user.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get My Profile
 * @route   GET /api/v1/user/profile
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  // req.user is already populated by auth middleware
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, req.user, "Profile fetched successfully"));
});

/**
 * @desc    Update Profile
 * @route   PUT /api/v1/user/profile
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user._id, req.body, req.file);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, updatedUser, "Profile updated successfully"));
});

/**
 * @desc    Soft Delete Account
 * @route   DELETE /api/v1/user/profile
 */
export const deactivateAccount = asyncHandler(async (req, res) => {
  // Simple soft delete toggle
  const user = req.user;
  user.isActive = false;
  await user.save();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Account deactivated successfully"));
});