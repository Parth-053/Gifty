import { 
  registerUser, 
  loginUser, 
  refreshAccessToken 
} from "../../services/auth.service.js";
import { Seller } from "../../models/seller.model.js"; 
import { User } from "../../models/User.model.js"; 
import { sendEmail } from "../../services/email.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { 
  accessTokenCookieOptions, 
  refreshTokenCookieOptions 
} from "../../utils/tokens.js";
import crypto from "crypto";

/**
 * @desc    Register a new User (Support for both Customers & Sellers)
 * @route   POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {  
  const userData = {
    ...req.body,
    name: req.body.fullName || req.body.name  
  };

  // 1. Create User (Service creates user with isEmailVerified: false)
  const user = await registerUser(userData);
 
  // 2. Generate Verification Code & Save to User
  const verificationCode = user.generateVerificationCode();
  await user.save({ validateBeforeSave: false });

  // 3. Handle Seller Profile Creation (Safe Check to prevent Duplicates)
  if (req.body.role === 'seller') {
    const { storeName, fullName, phone, gstin } = req.body;
 
    // Check if seller profile already exists (e.g. from a failed previous attempt)
    const existingSeller = await Seller.findOne({ email: user.email });
    
    if (existingSeller) {
      // Update existing orphan record
      existingSeller.userId = user._id;
      existingSeller.fullName = fullName || user.name;
      existingSeller.phone = phone;
      existingSeller.storeName = storeName;
      existingSeller.gstin = gstin || existingSeller.gstin;
      await existingSeller.save();
    } else {
      // Create new seller record
      await Seller.create({
        userId: user._id,
        fullName: fullName || user.name,
        email: user.email,
        phone,
        storeName,
        gstin: gstin || null,
        status: "pending" 
      });
    }
  }

  // 4. Send Verification Email
  try {
    await sendEmail({
      email: user.email,
      subject: "Gifty - Verify your email",
      message: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Gifty!</h2>
          <p>Please use the code below to verify your account:</p>
          <h1 style="color: #2563EB; letter-spacing: 5px; font-size: 32px;">${verificationCode}</h1>
          <p>This code expires in 15 minutes.</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    // We don't throw error here, so the user is still created. 
    // Client can request "Resend OTP" later if needed.
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "Registration successful. Please check your email for verification code."));
});

/**
 * @desc    Verify Email with OTP
 * @route   POST /api/v1/auth/verify-email
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ApiError(400, "Email and Code are required");
  }

  // 1. Find user with this email (select hidden verification fields)
  const user = await User.findOne({ email }).select("+verificationCode +verificationCodeExpire");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 2. Check if already verified
  if (user.isEmailVerified) {
    return res.status(200).json(new ApiResponse(200, {}, "Email already verified. Please login."));
  }

  // 3. Verify Code & Expiry
  // Since User model hashes the code, we must hash the input code to compare
  const hashedCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  if (user.verificationCode !== hashedCode) {
    throw new ApiError(400, "Invalid verification code");
  }

  if (user.verificationCodeExpire < Date.now()) {
    throw new ApiError(400, "Verification code has expired");
  }

  // 4. Mark User as Verified
  user.isEmailVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully!"));
});

/**
 * @desc    Login and return profile status
 * @route   POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser(email, password);
 
  // 1. Check Email Verification
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  let sellerStatus = null;

  // 2. Check if the user is a seller to provide status for ProtectedRoute
  if (user.role === 'seller') {
    const sellerProfile = await Seller.findOne({ userId: user._id });
    sellerStatus = sellerProfile?.status || "pending"; 
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
          sellerStatus, 
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
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User session is active"));
});