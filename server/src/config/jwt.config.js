import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  // Access Token (Short lived: 15m - 1h)
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
  accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || "1d",

  // Refresh Token (Long lived: 7d - 30d)
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || "10d",
};