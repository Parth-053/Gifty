import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshToken } from "../utils/tokens.js";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";
import { sendEmail } from "./email.service.js"; 

/**
 * Register New User
 */
export const registerUser = async (userData) => {
  const { email, phone, password, fullName, role = "user" } = userData;

  if ([email, password, fullName, phone].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All registration fields are required");
  }

  const existingUser = await User.findOne({ 
    $or: [{ email }, { phone }] 
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or phone already exists");
  }

  // 1. Create User
  const user = await User.create({
    name: fullName,
    email,
    phone,
    password,
    role
  });

  // 2. Generate and Save Verification Code
  // Note: generateVerificationCode is a method on the User instance
  const verificationCode = user.generateVerificationCode(); 
  await user.save({ validateBeforeSave: false });

  // 3. Send Email
  try {
    await sendEmail({
      email: user.email,
      subject: "Gifty - Verify your email",
      message: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Gifty!</h2>
          <p>Please use the code below to verify your account:</p>
          <h1 style="color: #2563EB; letter-spacing: 5px;">${verificationCode}</h1>
          <p>This code expires in 15 minutes.</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Verification email failed:", error);
  }

  const createdUser = await User.findById(user._id).select("-password -refreshToken -verificationCode");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

/**
 * Login User
 */
export const loginUser = async (email, password) => {
  // 1. Find User with password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 2. Check Password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 3. Generate Tokens
  // FIX: Passed the full 'user' object, NOT 'user._id'
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

  // 4. Update Refresh Token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return { user: loggedInUser, accessToken, refreshToken };
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  try {
    // 1. Verify incoming token
    const decodedToken = jwt.verify(
      incomingRefreshToken, 
      envConfig.jwt.refreshSecret
    );

    // 2. Find user
    const user = await User.findById(decodedToken?._id).select("+refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // 3. Generate new pair
    // FIX: Passed the full 'user' object here as well
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user);

    // 4. Update DB with new refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};