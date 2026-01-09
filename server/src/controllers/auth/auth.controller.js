import { 
  registerUser, 
  loginUser, 
  refreshAccessToken 
} from "../../services/auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus, cookieOptions } from "../../utils/constants.js";

/**
 * @desc    Register a new user (Customer)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  // Validation is already handled by middleware (Joi) before reaching here
  const { name, email, password, phone } = req.body;

  const user = await registerUser({ name, email, password, phone });

  return res
    .status(httpStatus.CREATED)
    .json(
      new ApiResponse(
        httpStatus.CREATED, 
        user, 
        "User registered successfully"
      )
    );
});

/**
 * @desc    Login (User / Seller / Admin)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Call Service
  const { user, accessToken, refreshToken } = await loginUser(email, password);

  // 2. Set Cookies
  // Access Token: Short lived (e.g., 15 mins)
  // Refresh Token: Long lived (e.g., 10 days)
  
  return res
    .status(httpStatus.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        httpStatus.OK,
        { 
          user, 
          accessToken, // Sending tokens in body too (useful for Mobile Apps)
          refreshToken 
        }, 
        `Welcome back, ${user.name}!`
      )
    );
});

/**
 * @desc    Logout user (Clear cookies)
 * @route   POST /api/v1/auth/logout
 * @access  Private (Requires JWT)
 */
export const logout = asyncHandler(async (req, res) => {
  // We clear cookies by setting them to empty and expiring them immediately
  // Note: We need to pass the same options (secure, sameSite) used while setting
  return res
    .status(httpStatus.OK)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new ApiResponse(httpStatus.OK, {}, "Logged out successfully")
    );
});

/**
 * @desc    Refresh Access Token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public (Uses Refresh Token Cookie)
 */
export const refresh = asyncHandler(async (req, res) => {
  // Try getting token from Cookie first, fallback to Body
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
  }

  // Service handles verification and generation logic
  const newAccessToken = await refreshAccessToken(incomingRefreshToken);

  return res
    .status(httpStatus.OK)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .json(
      new ApiResponse(
        httpStatus.OK,
        { accessToken: newAccessToken },
        "Access token refreshed"
      )
    );
});

/**
 * @desc    Get Current User Profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is injected by the authMiddleware (verifyJWT)
  return res
    .status(httpStatus.OK)
    .json(
      new ApiResponse(
        httpStatus.OK,
        req.user,
        "Current user fetched successfully"
      )
    );
});