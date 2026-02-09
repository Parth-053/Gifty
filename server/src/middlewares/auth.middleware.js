import admin from "../config/firebase.js";
import { User } from "../models/User.model.js";
import { Seller } from "../models/Seller.model.js"; 
import {ApiError} from "../utils/ApiError.js"; 
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

    // 2. Identify User (Customer/Admin)
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
      // Attach to req.seller AND req.user for compatibility with controllers that expect req.user
      req.seller = seller;
      req.user = seller; // Helpful fallback so controllers reading req.user._id still work
      req.role = "seller"; // Enforce seller role
      req.id = seller._id;
      return next();
    }

    // --- CRITICAL FIX: Allow Registration Routes ---
    // This allows the "Create Profile" request to pass even if the profile doesn't exist yet
    if (
      req.originalUrl.includes("/sync") || 
      req.path.includes("/sync") ||
      req.originalUrl.includes("/register-seller") || 
      req.path.includes("/register-seller") ||
      req.method === "POST" && req.originalUrl.includes("/auth/google") // Allow initial Google sync
    ) {
        return next();
    }

    // 5. If no profile and not registering -> 404
    throw new ApiError(404, "Profile not found. Please complete registration.");

  } catch (error) {
    // Handle Token Expiration specifically
    if (error.code === 'auth/id-token-expired') {
        throw new ApiError(401, "Token expired. Please login again.");
    }
    
    if (error instanceof ApiError) throw error;
    
    console.error("Auth Middleware Error:", error);
    throw new ApiError(401, "Invalid Authentication Token");
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