import { Router } from "express";
import { 
  getWishlist, 
  toggleWishlistItem 
} from "../../controllers/user/wishlist.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { toggleWishlistSchema } from "../../validations/wishlist.schema.js";

const router = Router();

router.use(verifyAuth);

router.get("/", getWishlist);
router.post("/toggle", validate(toggleWishlistSchema), toggleWishlistItem);

export default router;