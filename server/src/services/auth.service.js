import { User } from "../models/User.model.js";
import { ApiError } from "../utils/apiError.js";
import { generateAccessAndRefreshToken } from "../utils/tokens.js";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

/**
 * Register New User
 * - Sync with Register.jsx fields (fullName, phone, etc.)
 */
export const registerUser = async (userData) => {
  const { email, phone, password, fullName, role = "user" } = userData;

  // 1. Validation for essential fields
  if ([email, password, fullName, phone].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All registration fields are required");
  }

  // 2. Check if user already exists (Email or Phone)
  const existingUser = await User.findOne({ 
    $or: [{ email }, { phone }] 
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or phone already exists");
  }

  // 3. Create User in Auth Collection
  // Note: fullName and phone are now passed to the User model as well for consistency
  const user = await User.create({
    name: fullName,
    email,
    phone,
    password,
    role
  });

  // 4. Return clean user object
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

/**
 * Login User
 * - Verifies credentials
 * - Generates Token Pair
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

  // 3. Generate Tokens using Utility
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // 4. Update Refresh Token in DB for rotation security
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return { user: loggedInUser, accessToken, refreshToken };
};

/**
 * Refresh Access Token
 * - Implements Token Rotation Security
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  try {
    // 1. Verify incoming token
    const decodedToken = jwt.verify(
      incomingRefreshToken, 
      envConfig.jwt.refreshSecret
    );

    // 2. Find user and check token validity
    const user = await User.findById(decodedToken?._id).select("+refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // 3. Generate new pair
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    // 4. Update DB with new refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};
