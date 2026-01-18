import { User } from "../../models/User.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import crypto from "crypto";
import { sendEmail } from "../../services/email.service.js"; 

/**
 * @desc    Change Password (Logged In User)
 * @route   POST /api/v1/auth/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // 1. Get user with password
  const user = await User.findById(req.user._id).select("+password");

  // 2. Check old password
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }

  // 3. Update Password
  user.password = newPassword; 
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

/**
 * @desc    Forgot Password (Send Reset Link)
 * @route   POST /api/v1/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Security: Don't reveal if user exists or not, just say email sent
    // throw new ApiError(404, "User not found"); 
    return res.status(200).json(new ApiResponse(200, {}, "If email exists, reset link sent."));
  }

  // 1. Generate Token (Method in User Model - see Step 2)
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 2. Send Email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `Your password reset token is: \n\n ${resetUrl} \n\n If you has not requested this email then, please ignore it.`;

  try {
     await sendEmail({
      email: user.email,
      subject: `Password Reset Recovery`,
      message,
     });
    
    // For DEV only: Log token to console if email service not ready
    console.log("DEV MODE - Reset Token:", resetToken);
    console.log("DEV MODE - Reset URL:", resetUrl);

    return res.status(200).json(new ApiResponse(200, {}, `Email sent to ${user.email}`));
  } catch (error) {
    // Rollback if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }
});

/**
 * @desc    Reset Password (Using Token)
 * @route   POST /api/v1/auth/reset-password/:token
 */
export const resetPassword = asyncHandler(async (req, res) => {
  // 1. Hash incoming token to match DB
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2. Find User with valid token and time
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }

  // 3. Set New Password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful. Please login."));
});