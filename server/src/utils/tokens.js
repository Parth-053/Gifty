import { envConfig } from "../config/env.config.js";

/**
 * Standard Cookie Options
 * keeping cookies secure against XSS/CSRF
 */
const cookieOptions = {
  httpOnly: true, // JavaScript cannot read this (Prevents XSS)
  secure: envConfig.env === "production", // Only send over HTTPS in Production
  sameSite: envConfig.env === "production" ? "None" : "Lax", // Cross-site logic
  // domain: ".abcdomain.com" // (Optional) Enable this when deploying to real domain
};

// Specific Options for Access Token (Short Lived)
export const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000, // 15 Minutes
};

// Specific Options for Refresh Token (Long Lived)
export const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

/**
 *  Generate Access & Refresh Tokens
 * Generates tokens using User Model methods and saves Refresh Token to DB.
 * * @param {Object} user - The Mongoose User Document
 * @returns {Promise<Object>} { accessToken, refreshToken }
 */
export const generateAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save Refresh Token in Database (For Rotation/Revocation support)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // Skip validation to be faster

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error while generating tokens: " + error.message);
  }
};