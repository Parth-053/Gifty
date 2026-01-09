import User from "../../models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";
import { hashPassword, comparePassword } from "../../utils/password.util.js";

/**
 * @desc    Update Account Details (Name, Phone)
 * @route   PATCH /api/v1/users/profile
 * @access  Private
 */
export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  // req.user._id comes from verifyJWT middleware
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        ...(name && { name }), 
        ...(phone && { phone }) 
      }
    },
    { new: true, runValidators: true }
  ).select("-passwordHash"); // Exclude password from response

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, user, "Account details updated successfully"));
});

/**
 * @desc    Change Current Password
 * @route   POST /api/v1/users/change-password
 * @access  Private
 */
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // 1. Find User with Password (select: false logic requires explicit select)
  const user = await User.findById(req.user._id).select("+passwordHash");

  // 2. Verify Old Password
  const isPasswordCorrect = await comparePassword(oldPassword, user.passwordHash);
  if (!isPasswordCorrect) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid old password");
  }

  // 3. Hash & Save New Password
  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Password changed successfully"));
});