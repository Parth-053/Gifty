import jwt from "jsonwebtoken";

/**
 * Generate Access Token (Short lived: 15m - 1h)
 * Used for authentication on every request
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      email: user.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

/**
 * Generate Refresh Token (Long lived: 7d - 30d)
 * Used to get a new Access Token without logging in again
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

/**
 * Generate Temporary Token (for Email Verification / Password Reset)
 */
export const generateTempToken = (payload, expiresIn = "10m") => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn }
  );
};