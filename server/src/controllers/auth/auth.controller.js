import { 
  registerUser, 
  loginUser, 
  refreshAccessToken 
} from "../../services/auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { 
  accessTokenCookieOptions, 
  refreshTokenCookieOptions 
} from "../../utils/tokens.js";

/**
 * @route   POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  // Logic is in Service, Validation is in Middleware
  const user = await registerUser(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

/**
 * @route   POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser(email, password);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

/**
 * @route   POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  // In a real scenario, you might want to remove the refreshToken from DB here.
  // await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  
  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

/**
 * @route   POST /api/v1/auth/refresh-token
 */
export const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken = 
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json(new ApiResponse(401, null, "Refresh token is missing"));
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
 * @route   GET /api/v1/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});