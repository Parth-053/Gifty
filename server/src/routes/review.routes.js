import { Router } from "express";
import { 
  addReview, 
  deleteReview, 
  getProductReviews 
} from "../controllers/user/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public: View Reviews
router.get("/:productId", getProductReviews);

// Protected: Add/Delete
router.post("/:productId", 
  verifyJWT, 
  upload.array("images", 3), // Allow 3 review images
  addReview
);

router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;