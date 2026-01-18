import * as reviewService from "../../services/review.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

/**
 * @desc    Add Review
 * @route   POST /api/v1/products/:id/reviews
 */
export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.addReview(req.user._id, {
    productId: req.params.id,
    ...req.body
  });
  return res.status(201).json(new ApiResponse(201, review, "Review added"));
});

/**
 * @desc    Get Reviews
 * @route   GET /api/v1/products/:id/reviews
 */
export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getProductReviews(req.params.id);
  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched"));
});