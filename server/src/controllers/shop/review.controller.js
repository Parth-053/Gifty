import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as reviewService from "../../services/review.service.js";
import { Review } from "../../models/Review.model.js";  
import { ApiFeatures } from "../../utils/ApiFeatures.js"; 
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Add Review
 * @route   POST /api/v1/products/:id/reviews
 */
export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.addReview(req.user._id, {
    productId: req.params.id,
    rating: req.body.rating,
    comment: req.body.comment
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, review, "Review submitted successfully"));
});

/**
 * @desc    Get Product Reviews
 * @route   GET /api/v1/products/:id/reviews
 */
export const getReviews = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // Use ApiFeatures for pagination (e.g. ?page=1&limit=5)
  // Force filter by productId
  const features = new ApiFeatures(Review.find({ productId }).populate("userId", "fullName avatar"), req.query)
    .sort() // Sort by newest (default) or helpfulness
    .paginate();

  const reviews = await features.query;
  const total = await Review.countDocuments({ productId });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { reviews, total }, "Reviews fetched successfully"));
});