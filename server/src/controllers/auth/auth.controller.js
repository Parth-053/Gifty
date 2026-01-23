import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as authService from "../../services/auth.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Sync User (Login/Register)
 * @route   POST /api/v1/auth/sync/user
 * @access  Private (Requires valid Firebase Token)
 */
export const syncUser = asyncHandler(async (req, res) => {
  // req.uid, req.email, req.emailVerified come from verifyAuth middleware
  const userData = {
    firebaseUid: req.uid,
    email: req.email,
    isEmailVerified: req.emailVerified,
    fullName: req.body.fullName,
    phone: req.body.phone,
    avatar: req.body.avatar, // Expecting object: { url, publicId }
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
 * @desc    Sync Seller (Application/Login)
 * @route   POST /api/v1/auth/sync/seller
 * @access  Private (Requires valid Firebase Token)
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
 * @desc    Get Current Profile (User or Seller)
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  // req.role is determined by the verifyAuth middleware (checks DB)
  // If role is missing (e.g. first sync call), default to 'user' lookup or handle gracefully
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
  // Since Firebase tokens are stateless, the backend doesn't store a session to "destroy".
  // However, we return a success response so the frontend can clear its local state (Context/Redux).
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Logged out successfully"));
});