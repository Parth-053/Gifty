import { Router } from "express";
import { 
  getWishlist, 
  toggleWishlistItem 
} from "../../controllers/user/wishlist.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlistItem);

export default router;