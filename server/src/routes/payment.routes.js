import express from "express";
import { markPaymentSuccess } from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/success", protect, markPaymentSuccess);

export default router;
