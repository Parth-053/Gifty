import { Router } from "express";
import * as authController from "../../controllers/auth/auth.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { syncUserSchema } from "../../validations/auth.schema.js";

const router = Router();

// --- Public Routes ---
// Send OTP (Used by both User and Seller registration)
router.post("/send-otp", authController.sendOtp); 

// Verify OTP (Standalone verifier used by User registration)
router.post("/verify-otp", authController.verifyOtp);

// --- Protected Routes (Requires Firebase Token) ---

// Register Seller (Verifies OTP inside the controller and creates seller account)
router.post(
  "/register-seller",
  verifyAuth,
  authController.registerSeller
);

// Sync User (Buyer Login & Registration Sync)
router.post(
  "/sync/user",
  verifyAuth,
  validate(syncUserSchema),
  authController.syncUser
);

// Sync Seller (Seller Login Only)
router.post(
  "/sync/seller", 
  verifyAuth, 
  authController.syncSeller
);

// Common Auth (Fetch profile, Logout)
router.get("/me", verifyAuth, authController.getMe);
router.post("/logout", verifyAuth, authController.logout);

export default router;