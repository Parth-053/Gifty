import { Router } from "express";
import { 
  getMyCart, 
  addItemToCart, 
  updateItemQuantity 
} from "../../controllers/shop/cart.controller.js"; 
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .get(getMyCart);

router.post("/add", addItemToCart);
router.put("/update", updateItemQuantity);

export default router;