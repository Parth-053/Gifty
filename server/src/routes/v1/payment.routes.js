import { Router } from "express";
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment 
} from "../../controllers/shop/payment.controller.js";
import { getCheckoutSummary } from "../../controllers/shop/checkout.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyAuth);

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);
router.post("/checkout-summary", getCheckoutSummary);  

export default router;