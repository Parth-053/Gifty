import { User } from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Get All Users (Pagination + Search)
 * @route   GET /api/v1/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role } = req.query;

  const query = {};
  
  // Search by Name or Email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  // Filter by Role (user/seller/admin)
  if (role) {
    query.role = role;
  }

  const users = await User.find(query)
    .select("-password -refreshToken") // Exclude sensitive info
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  return res.status(200).json(new ApiResponse(200, {
    users,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  }, "Users fetched successfully"));
});

/**
 * @desc    Get Single User Details
 * @route   GET /api/v1/admin/users/:id
 */
export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, "User details fetched"));
});

/**
 * @desc    Ban/Unban User (Soft Block)
 * @route   PUT /api/v1/admin/users/:id/status
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body; // true/false
  
  // Assuming User model has isActive field (Or use isEmailVerified as proxy if strict ban needed)
  // Ideally, add `isBanned: { type: Boolean, default: false }` to User Model if not present.
  // For now, let's assume we toggle email verification to block login or add a new field dynamically.
  
  /* NOTE: If 'isBanned' field is missing in your User Model (Step 2), 
     please add it or use a workaround. Here I assume you added it or will add it.
  */
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  // Prevent banning other admins
  if (user.role === 'admin') throw new ApiError(403, "Cannot ban an admin");

  user.isEmailVerified = isActive; // Example: Disable login by un-verifying
  // OR: user.isBanned = !isActive;
  
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, user, `User status updated`));
});

/**
 * @desc    Delete User (Hard Delete - Use with caution)
 * @route   DELETE /api/v1/admin/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, {}, "User deleted permanently"));
});