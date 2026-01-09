import { Router } from "express";
import { 
  checkout, 
  verifyPayment, 
  getMyOrders, 
  getOrderDetails, 
  cancelMyOrder 
} from "../controllers/user/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { 
  checkoutSchema, 
  verifyPaymentSchema 
} from "../validations/order.validation.js";

const router = Router();

router.use(verifyJWT);

router.post("/checkout", validate(checkoutSchema), checkout);
router.post("/verify-payment", validate(verifyPaymentSchema), verifyPayment);

router.get("/", getMyOrders);
router.get("/:orderId", getOrderDetails);
router.post("/:orderId/cancel", cancelMyOrder);

export default router;