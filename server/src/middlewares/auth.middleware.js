import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";
import User from "../models/user.model.js";

/**
 * Verify JWT Access Token
 * Injects the authenticated user into `req.user`
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 1. Get token from Cookie OR Header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized request");
    }

    // 2. Verify Token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find User (Exclude sensitive data like password)
    // We strictly check DB to ensure user wasn't deleted/banned recently
    const user = await User.findById(decodedToken?._id).select("-passwordHash");

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Access Token");
    }

    // 4. Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid access token");
  }
});

/**
 * Role Based Authorization
 * @param {...String} roles - Allowed roles (e.g. "admin", "seller")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        httpStatus.FORBIDDEN, 
        `Role: ${req.user.role} is not allowed to access this resource`
      );
    }
    next();
  };
};