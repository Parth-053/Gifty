import { 
  registerUser, 
  loginUser, 
  refreshAccessToken 
} from "../../services/auth.service.js";
import { Seller } from "../../models/seller.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { 
  accessTokenCookieOptions, 
  refreshTokenCookieOptions 
} from "../../utils/tokens.js";

/**
 * @desc    Register a new User (Support for both Customers & Sellers)
 * @route   POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {  
  const userData = {
    ...req.body,
    name: req.body.fullName || req.body.name  
  };

  const user = await registerUser(userData);
 
  // 2. If the user is registering as a seller, create the Seller Profile
  if (req.body.role === 'seller') {
    const { storeName, fullName, phone, gstin } = req.body;
 
    await Seller.create({
      userId: user._id,
      fullName: fullName || user.name, // Consistency with profile
      email: user.email,
      phone,
      storeName,
      gstin: gstin || null,
      status: "pending" // Default status for Admin approval logic
    });
  }

  

  return res
    .status(201)
    .json(new ApiResponse(201, user, "Registration successful. Please verify email."));
});

/**
 * @desc    Login and return profile status (Universal Login)
 * @route   POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser(email, password);
 
  let sellerStatus = null;

  // 1. Check if the user is a seller to provide status for ProtectedRoute
  if (user.role === 'seller') {
    const sellerProfile = await Seller.findOne({ userId: user._id });
    sellerStatus = sellerProfile?.status || "pending"; // Critical for Frontend redirect logic
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        { 
          user, 
          sellerStatus, // Matches Login.jsx and authSlice expectations
          accessToken, 
          refreshToken 
        },
        "Login successful"
      )
    );
});

/**
 * @desc    Logout and clear session
 * @route   POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear both tokens from cookies for security
  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

/**
 * @desc    Refresh session tokens
 */
export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing");
  }

  const { accessToken, refreshToken } = await refreshAccessToken(incomingRefreshToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});

/**
 * @desc    Get Current Session User (Me)
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // Returns req.user populated by verifyJWT middleware
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User session is active"));
});