import { Router } from "express";
import { 
  createReview, 
  getReviews 
} from "../../controllers/shop/review.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public: Get Reviews
router.get("/:id", getReviews);

// Protected: Add Review
router.post("/:id", verifyJWT, createReview);

export default router;