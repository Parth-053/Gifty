import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { envConfig } from "../config/env.config.js";
import { ApiError } from "../utils/ApiError.js"; 
import { asyncHandler } from "../utils/asyncHandler.js"; 

/**
    Verify JWT Access Token
    Checks cookies or Authorization header
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // 1. Get token from Cookie OR Header
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request. Please login first.");
  }

  try {
    // 2. Verify Token
    const decodedToken = jwt.verify(token, envConfig.jwt.accessSecret);

    // 3. Find User (Select only necessary fields)
    const user = await User.findById(decodedToken._id).select(
      "-password -refresh_token -loginAttempts -lockUntil"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token. User not found.");
    }

    // 4. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

/**
 * Role Based Access Control (RBAC)
 * @param {...string} roles - Allowed roles (e.g. "admin", "seller")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access Forbidden: You do not have permission to access this resource. Required: ${roles.join(" or ")}`
      );
    }
    next();
  };
};