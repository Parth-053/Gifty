import admin from "../config/firebase.js";
import { User } from "../models/User.model.js";
import { Seller } from "../models/Seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Verify Firebase Token & Attach User/Seller to Request
 */
export const verifyAuth = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request. No token provided.");
  }

  try {
    // 1. Verify Token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;
    req.emailVerified = decodedToken.email_verified;

    // 2. Identify if User or Seller (Check User collection first)
    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (user) {
      req.user = user;
      req.role = user.role; // 'user' or 'admin'
      req.id = user._id; // Common ID reference
      return next();
    }

    // 3. If not User, check Seller collection
    const seller = await Seller.findOne({ firebaseUid: decodedToken.uid });

    if (seller) {
      req.seller = seller;
      req.role = "seller";
      req.id = seller._id; // Common ID reference
      return next();
    }

    // 4. If neither (New Registration flow), pass only UID info
    // This allows /auth/sync endpoints to work for new users
    if (req.path.includes("/sync")) {
        return next();
    }

    throw new ApiError(401, "Profile not found. Please complete registration.");

  } catch (error) {
    throw new ApiError(401, "Invalid or Expired Token", [], error.stack);
  }
});

/**
 * RBAC: Restrict Access to Specific Roles
 * Usage: authorizeRoles("admin", "seller")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      throw new ApiError(403, "Access Denied. You do not have permission.");
    }
    next();
  };
};