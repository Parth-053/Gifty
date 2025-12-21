import express from "express";
import {
  register,
  sellerRegister,
  verifyEmailOTP,
  resendOTP,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/seller/register", sellerRegister);

/* AUTH */
router.post("/login", login);
router.post("/verify-otp", verifyEmailOTP);
router.post("/resend-otp", resendOTP);

/* PROFILE */
router.get("/me", protect, getMe);

export default router;
