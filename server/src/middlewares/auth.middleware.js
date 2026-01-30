import admin from "../config/firebase.js";
import { User } from "../models/User.model.js";
import { Seller } from "../models/Seller.model.js"; 
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAuth = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request. No token provided.");
  }

  try {
    // 1. Verify Token with Firebase
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

    // --- THE FIX IS HERE ---
    // 4. Allow Registration Routes to pass without a DB profile
    // We added "register-seller" to this check
    if (
        req.originalUrl.includes("/sync") || 
        req.path.includes("/sync") ||
        req.originalUrl.includes("/register-seller") || 
        req.path.includes("/register-seller")
    ) {
        return next();
    }

    // 5. If no profile and not registering -> 404
    throw new ApiError(404, "Profile not found. Please complete registration.");

  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Auth Middleware Error:", error);
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