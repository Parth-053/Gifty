/**
 * @file constants.js
 * @description Centralized constants for the application.
 */

export const DB_NAME = "gifty_db";

export const httpStatus = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});

/**
 * User Roles
 * 🔥 UPDATED: Now includes ADMIN because we use a Unified User Model
 */
export const UserRoles = Object.freeze({
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin" 
});

export const OrderStatus = Object.freeze({
  PLACED: "placed",
  PACKED: "packed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

export const PaymentStatus = Object.freeze({
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
});

export const PaymentMethod = Object.freeze({
  COD: "cod",
  ONLINE: "online",
});

export const ProductVisibility = Object.freeze({
  PUBLIC: "public",
  HIDDEN: "hidden",
});

export const cookieOptions = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

export const Pagination = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
});