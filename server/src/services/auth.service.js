import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshToken } from "../utils/tokens.js";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

/**
 * Register New User
 * - Checks for existing user
 * - Creates new user
 * - Returns user without sensitive data
 */
export const registerUser = async (userData) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email: userData.email }, { phone: userData.phone }] 
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or phone already exists");
  }

  // 2. Create User
  const user = await User.create(userData);

  // 3. Remove Sensitive Fields
  const createdUser = await User.findById(user._id).select("-password -role -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

/**
 *   Login User
 * - Finds user by email
 * - Verifies password using Model method
 * - Generates Access & Refresh Tokens
 */
export const loginUser = async (email, password) => {
  // 1. Find User (Explicitly select password as it's hidden by default)
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
  // Fetch user again without password to keep the object clean
  const loggedInUser = await User.findById(user._id).select("-password -refresh_token");
  
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(loggedInUser);

  return { user: loggedInUser, accessToken, refreshToken };
};

/**
 *   Refresh Access Token
 * - Verifies Refresh Token
 * - Checks if token matches the one in DB (Rotation Check)
 * - Issues new pair of tokens
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  try {
    // 1. Verify Token
    const decodedToken = jwt.verify(incomingRefreshToken, envConfig.jwt.refreshSecret);

    // 2. Find User
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // 3. Check if Incoming Token Matches Database Token (Rotation Check)
    // Explicitly select refreshToken as it is excluded by default
    const userWithToken = await User.findById(user._id).select("+refreshToken");
    
    if (incomingRefreshToken !== userWithToken.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // 4. Generate New Tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};