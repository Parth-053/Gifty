import { Router } from "express";
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment 
} from "../../controllers/shop/payment.controller.js";
import { getCheckoutSummary } from "../../controllers/shop/checkout.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);
router.post("/checkout-summary", getCheckoutSummary); // Pre-payment check

export default router;