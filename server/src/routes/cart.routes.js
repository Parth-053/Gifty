import { Router } from "express";
import { 
  getUserCart, 
  addItemToCart, 
  updateItemQuantity, 
  removeItem, 
  clearUserCart 
} from "../controllers/user/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getUserCart);
router.post("/add", addItemToCart);
router.patch("/update", updateItemQuantity);
router.delete("/remove", removeItem); // Using body in DELETE is allowed in modern specs
router.delete("/clear", clearUserCart);

export default router;