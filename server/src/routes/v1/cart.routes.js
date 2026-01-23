import { Router } from "express";
import { 
  getMyCart, 
  addItemToCart, 
  updateItemQuantity,
  removeItem,
  clearCart
} from "../../controllers/shop/cart.controller.js"; 
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "../../validations/cart.schema.js";

const router = Router();

router.use(verifyAuth);

router.route("/")
  .get(getMyCart)
  .delete(clearCart);

router.post("/add", validate(addToCartSchema), addItemToCart);
router.put("/update", validate(updateCartItemSchema), updateItemQuantity);
router.delete("/:productId", removeItem);

export default router;