import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";
import { Otp } from "../../models/Otp.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { User } from "../../models/User.model.js";
import * as authService from "../../services/auth.service.js";
import { sendOtpEmail, sendWelcomeEmail } from "../../services/email.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Generate and Send OTP
 * @route   POST /api/v1/auth/send-otp
 * @access  Public
 */
export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  // 1. Check if Seller already exists in DB
  const existingSeller = await Seller.findOne({ email });
  if (existingSeller) {
    throw new ApiError(400, "Account already exists. Please login.");
  }

  // 2. Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 3. Store in DB (Delete any old OTPs for this email first)
  await Otp.deleteMany({ email });
  await Otp.create({ email, otp });

  // 4. Send Email via Service
  const emailSent = await sendOtpEmail(email, otp);
  
  if (!emailSent) {
    throw new ApiError(500, "Failed to send verification email. Please check your email address.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, `Verification code sent to ${email}`));
});

/**
 * @desc    Verify OTP and Register Seller
 * @route   POST /api/v1/auth/register-seller
 * @access  Private (Requires Firebase Token)
 */
export const registerSeller = asyncHandler(async (req, res) => {
  // Extract all registration data from request body
  const { 
    otp, 
    email, 
    fullName, 
    storeName, 
    phone, 
    gstin, 
    address, 
    bankDetails 
  } = req.body;
  
  const firebaseUid = req.uid; // From auth middleware

  // 1. Verify OTP
  const validOtp = await Otp.findOne({ email, otp });
  if (!validOtp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // 2. Check if Seller/User already exists (Double check)
  const existingSeller = await Seller.findOne({ $or: [{ email }, { firebaseUid }] });
  if (existingSeller) throw new ApiError(400, "Seller account already exists.");

  // 3. Create Seller in MongoDB
  const newSeller = await Seller.create({
    firebaseUid,
    email,
    fullName,
    storeName,
    phone,
    gstin: gstin || "",
    status: "pending", // <--- Critical: Set to Pending for Admin Approval
    isVerified: true,  // Email is verified via OTP
    onboardingCompleted: true,
    address,
    bankDetails
  });

  // 4. Delete used OTP
  await Otp.deleteOne({ _id: validOtp._id });

  // 5. Send Welcome Email (Async, don't block response)
  try {
      await sendWelcomeEmail(email, fullName);
  } catch (err) {
      console.error("Welcome email failed", err);
  }

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, newSeller, "Seller application submitted. Pending Admin Approval."));
});

/**
 * @desc    Sync User (Login/Register for Buyers)
 * @route   POST /api/v1/auth/sync/user
 */
export const syncUser = asyncHandler(async (req, res) => {
  const userData = {
    firebaseUid: req.uid,
    email: req.email,
    isEmailVerified: req.emailVerified,
    fullName: req.body.fullName,
    phone: req.body.phone,
    avatar: req.body.avatar, 
  };

  const { user, isNewUser } = await authService.syncUser(userData);

  return res
    .status(isNewUser ? httpStatus.CREATED : httpStatus.OK)
    .json(new ApiResponse(isNewUser ? httpStatus.CREATED : httpStatus.OK, user, isNewUser ? "User registered" : "User login successful"));
});

/**
 * @desc    Sync Seller (For Login Only - Not Registration)
 * @route   POST /api/v1/auth/sync/seller
 */
export const syncSeller = asyncHandler(async (req, res) => {
  // Use this ONLY for login, not for registration
  const sellerData = {
    firebaseUid: req.uid,
    email: req.email,
    fullName: req.body.fullName,
    storeName: req.body.storeName,
    phone: req.body.phone,
    gstin: req.body.gstin || ""
  };

  const { seller, isNewSeller } = await authService.syncSeller(sellerData);

  return res
    .status(isNewSeller ? httpStatus.CREATED : httpStatus.OK)
    .json(new ApiResponse(isNewSeller ? httpStatus.CREATED : httpStatus.OK, seller, isNewSeller ? "Seller application submitted" : "Seller login successful"));
});

/**
 * @desc    Get Current Profile
 * @route   GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const role = req.role || "user"; 
  const profile = await authService.getProfile(req.uid, role);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, profile, "Profile fetched successfully"));
});

/**
 * @desc    Logout
 * @route   POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Logged out successfully"));
});