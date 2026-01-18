import { Router } from "express";
import { 
  createOrder, 
  getUserOrders, 
  getOrderDetails 
} from "../../controllers/user/order.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createOrderSchema } from "../../validations/order.schema.js";

const router = Router();

router.use(verifyJWT);

router.post("/", validate(createOrderSchema), createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderDetails);

export default router;