// server/src/middlewares/auth.middleware.js
import admin from "../config/firebase.js";
import { User } from "../models/User.model.js";
import { Seller } from "../models/Seller.model.js"; // Ensure filename matches case on disk
import {ApiError} from "../utils/apiError.js"; 
import {asyncHandler} from "../utils/asyncHandler.js";

// Middleware to verify Firebase Token & Attach User/Seller to Req
export const verifyAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized: No token provided');
  }

  const idToken = authHeader.split(' ')[1];

  try {
    // 1. Verify Token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;
    req.emailVerified = decodedToken.email_verified;

    // 2. Check User Collection
    let account = await User.findOne({ firebaseUid: decodedToken.uid });
    let role = 'user';

    // 3. If not found, Check Seller Collection
    if (!account) {
        account = await Seller.findOne({ firebaseUid: decodedToken.uid });
        role = 'seller';
    }

    if (!account) {
        // Only allow if it's the specific Sync/Register endpoint
        if (req.originalUrl.includes('/sync') || req.originalUrl.includes('/register')) {
            return next();
        }
        throw new ApiError(404, 'Account not found in database. Please register/sync.');
    }

    req.user = account;
    req.role = role;
    next();

  } catch (error) {
    console.error("Auth Error:", error);
    throw new ApiError(401, 'Unauthorized: Invalid token');
  }
});

// Role checking middleware
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.role || !allowedRoles.includes(req.role)) {
      throw new ApiError(403, `Access denied. Role '${req.role}' is not allowed.`);
    }
    next();
  };
};