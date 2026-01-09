import User from "../../models/user.model.js";
import Seller from "../../models/seller.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";

/**
 * @desc    Get All Users (Customers & Sellers)
 * @route   GET /api/v1/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const users = await User.find(filter)
    .select("-passwordHash") // Security: Never send passwords
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, { 
      users, 
      meta: { total, page: Number(page), pages: Math.ceil(total/limit) } 
    }, "Users fetched successfully")
  );
});

/**
 * @desc    Ban/Unban User
 * @route   PATCH /api/v1/admin/users/:userId/status
 * @note    Ensures you can't ban yourself (Admin)
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isVerified } = req.body; // Using isVerified as a proxy for "Active" for now

  // Prevent banning self
  if (userId === req.user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot ban yourself.");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isVerified }, // You can also add an 'isBlocked' field to your model later
    { new: true }
  ).select("-passwordHash");

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, user, `User status updated`)
  );
});

/**
 * @desc    Approve/Reject Seller
 * @route   PATCH /api/v1/admin/sellers/:sellerId/verify
 */
export const verifySeller = asyncHandler(async (req, res) => {
  const { sellerId } = req.params;
  const { status } = req.body; // 'approved', 'rejected', 'blocked'

  if (!["approved", "rejected", "blocked"].includes(status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status");
  }

  // 1. Update Seller Profile Status
  const seller = await Seller.findByIdAndUpdate(
    sellerId,
    { status }, 
    { new: true }
  );

  if (!seller) throw new ApiError(httpStatus.NOT_FOUND, "Seller profile not found");

  // 2. Sync logic (Optional): 
  // If rejected, you might want to downgrade user role back to 'user'
  if (status === "rejected") {
    await User.findByIdAndUpdate(seller.userId, { role: "user" });
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse(httpStatus.OK, seller, `Seller marked as ${status}`)
  );
});