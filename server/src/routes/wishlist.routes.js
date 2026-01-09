import { Router } from "express";
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from "../controllers/user/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getWishlist);
router.post("/add", addToWishlist);
router.delete("/remove", removeFromWishlist);

export default router;