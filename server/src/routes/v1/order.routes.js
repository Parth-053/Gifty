import { Router } from "express";
import { 
  createOrder, 
  getUserOrders, 
  getOrderDetails 
} from "../../controllers/shop/order.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createOrderSchema } from "../../validations/order.schema.js";

const router = Router();

router.use(verifyAuth);  

router.post("/", validate(createOrderSchema), createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderDetails);

export default router;