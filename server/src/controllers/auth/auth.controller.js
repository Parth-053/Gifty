import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as authService from "../../services/auth.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Sync User (Login/Register)
 * @route   POST /api/v1/auth/sync/user
 * @access  Private (Valid Firebase Token required)
 */
export const syncUser = asyncHandler(async (req, res) => {
  // req.uid and req.email come from verifyAuth middleware
  const userData = {
    firebaseUid: req.uid,
    email: req.email,
    isEmailVerified: req.emailVerified,
    fullName: req.body.fullName,
    phone: req.body.phone,
    avatar: req.body.avatar, // Expecting { url, publicId }
  };

  const { user, isNewUser } = await authService.syncUser(userData);

  const message = isNewUser 
    ? "User registered successfully" 
    : "User login successful";

  return res
    .status(isNewUser ? httpStatus.CREATED : httpStatus.OK)
    .json(new ApiResponse(isNewUser ? httpStatus.CREATED : httpStatus.OK, user, message));
});

/**
 * @desc    Sync Seller (Login/Register)
 * @route   POST /api/v1/auth/sync/seller
 * @access  Private (Valid Firebase Token required)
 */
export const syncSeller = asyncHandler(async (req, res) => {
  const sellerData = {
    firebaseUid: req.uid,
    email: req.email,
    fullName: req.body.fullName,
    storeName: req.body.storeName,
    phone: req.body.phone,
    gstin: req.body.gstin
  };

  const { seller, isNewSeller } = await authService.syncSeller(sellerData);

  const message = isNewSeller 
    ? "Seller application submitted successfully" 
    : "Seller login successful";

  return res
    .status(isNewSeller ? httpStatus.CREATED : httpStatus.OK)
    .json(new ApiResponse(isNewSeller ? httpStatus.CREATED : httpStatus.OK, seller, message));
});

/**
 * @desc    Get Current User/Seller Profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.role is attached by verifyAuth middleware if user exists in DB
  const role = req.role || "user"; 
  const profile = await authService.getProfile(req.uid, role);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, profile, "Profile fetched successfully"));
});

/**
 * @desc    Logout User
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Since we use stateless Firebase Tokens, backend logout isn't strictly necessary 
  // unless we track sessions. But we return success for frontend consistency.
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Logged out successfully"));
});