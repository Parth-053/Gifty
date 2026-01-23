import { User } from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Users (Search, Filter, Paginate)
 * @route   GET /api/v1/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  // Backend 2.0: Use ApiFeatures for automatic pagination & filtering
  const features = new ApiFeatures(User.find({ role: "user" }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  const total = await User.countDocuments({ role: "user" }); // Approximate count

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { users, total }, "Users fetched successfully"));
});

/**
 * @desc    Get Single User
 * @route   GET /api/v1/admin/users/:id
 */
export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("addresses");
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, user, "User details fetched"));
});

/**
 * @desc    Block/Unblock User
 * @route   PATCH /api/v1/admin/users/:id/status
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  // Prevent banning admins
  if (user.role === "admin") throw new ApiError(httpStatus.FORBIDDEN, "Cannot block an admin");

  // We use isEmailVerified as a proxy for "Active" if no specific status field exists,
  // OR strictly use an 'isActive' field if added to the model.
  user.isActive = isActive; 
  await user.save();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, user, `User ${isActive ? "unblocked" : "blocked"} successfully`));
});