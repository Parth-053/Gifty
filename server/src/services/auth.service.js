import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, phone }
 * @returns {Promise<Object>} - Created user (without password)
 */
export const registerUser = async (userData) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User with this email already exists");
  }

  // 2. Hash the password
  const hashedPassword = await hashPassword(userData.password);

  // 3. Create the user
  const user = await User.create({
    ...userData,
    passwordHash: hashedPassword,
  });

  // 4. Return user data (Mongoose 'select: false' ensures passwordHash is excluded)
  // We explicitly convert to object to ensure sensitive fields are stripped if needed
  const userResponse = user.toObject();
  delete userResponse.passwordHash;

  return userResponse;
};

/**
 * Login User
 * @param {String} email
 * @param {String} password
 * @returns {Promise<Object>} - { user, accessToken, refreshToken }
 */
export const loginUser = async (email, password) => {
  // 1. Find user and explicitly select password (since it's hidden by default)
  const user = await User.findOne({ email }).select("+passwordHash");

  // 2. Security: Use generic error message to prevent user enumeration
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // 3. Compare password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // 4. Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 5. Remove password from response
  const userResponse = user.toObject();
  delete userResponse.passwordHash;

  // Optional: Save refreshToken in DB if you want to support "Force Logout" later
  // user.refreshToken = refreshToken; 
  // await user.save();

  return { user: userResponse, accessToken, refreshToken };
};

/**
 * Refresh Access Token
 * @param {String} incomingRefreshToken
 * @returns {Promise<String>} - New Access Token
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  try {
    // 1. Verify the refresh token
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 2. Find the user
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    // 3. Generate new access token
    const newAccessToken = generateAccessToken(user);

    return newAccessToken;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
  }
};