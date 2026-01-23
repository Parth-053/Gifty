import { Router } from "express";
import { 
  createReview, 
  getReviews 
} from "../../controllers/shop/review.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createReviewSchema } from "../../validations/review.schema.js";

const router = Router();

// Public: Get Reviews
router.get("/:id", getReviews);

// Protected: Add Review
router.post(
  "/:id", 
  verifyAuth, 
  validate(createReviewSchema),
  createReview
);

export default router;