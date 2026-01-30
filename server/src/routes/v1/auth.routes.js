import { Router } from "express";
import * as authController from "../../controllers/auth/auth.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { syncUserSchema } from "../../validations/auth.schema.js";
// Note: You may want to create a validation schema for registerSeller in validations/seller.schema.js

const router = Router();

// --- Public Routes ---
// Send OTP (Does not require token usually, or you can require it if user is logged in via Firebase)
router.post("/send-otp", authController.sendOtp); 

// --- Protected Routes (Requires Firebase Token) ---

// Register Seller (Final Step with OTP)
router.post(
  "/register-seller",
  verifyAuth,
  // Add validate(registerSellerSchema) here if you create one
  authController.registerSeller
);

// Sync User (Buyer)
router.post(
  "/sync/user",
  verifyAuth,
  validate(syncUserSchema),
  authController.syncUser
);

// Common Auth
router.get("/me", verifyAuth, authController.getMe);
router.post("/logout", verifyAuth, authController.logout);

export default router;