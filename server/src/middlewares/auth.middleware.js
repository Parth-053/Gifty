import admin from "../config/firebase.js";
import { User } from "../models/User.model.js";
import { Seller } from "../models/Seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAuth = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request. No token provided.");
  }

  try {
    // 1. Verify Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;
    req.emailVerified = decodedToken.email_verified;

    // 2. Identify User
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (user) {
      req.user = user;
      req.role = user.role;
      req.id = user._id;
      return next();
    }

    // 3. Identify Seller
    const seller = await Seller.findOne({ firebaseUid: decodedToken.uid });
    if (seller) {
      req.seller = seller;
      req.role = "seller";
      req.id = seller._id;
      return next();
    }

    // 4. FIX: Allow Registration Routes (Check originalUrl to be safe)
    if (req.originalUrl.includes("/sync") || req.path.includes("/sync")) {
        return next();
    }

    throw new ApiError(401, "Profile not found. Please complete registration.");

  } catch (error) {
    throw new ApiError(401, "Invalid or Expired Token");
  }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      throw new ApiError(403, "Access denied. Insufficient permissions.");
    }
    next();
  };
};