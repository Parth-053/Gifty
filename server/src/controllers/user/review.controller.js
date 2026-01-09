import Review from "../../models/review.model.js";
import Order from "../../models/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus, OrderStatus } from "../../utils/constants.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.util.js";

/**
 * @desc    Add Review (Verified Purchase check)
 * @route   POST /api/v1/reviews/:productId
 */
export const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  // 1. Check duplicate
  const existingReview = await Review.findOne({ userId: req.user._id, productId });
  if (existingReview) throw new ApiError(httpStatus.BAD_REQUEST, "You already reviewed this product");

  // 2. Verified Purchase Logic
  const hasPurchased = await Order.findOne({
    userId: req.user._id,
    "items.productId": productId,
    orderStatus: OrderStatus.DELIVERED
  });

  // 3. Handle Image Uploads
  let reviewImages = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
    const results = await Promise.all(uploadPromises);
    reviewImages = results.filter(r => r !== null).map(r => ({ url: r.url, publicId: r.publicId }));
  }

  const review = await Review.create({
    userId: req.user._id,
    productId,
    rating,
    comment,
    images: reviewImages,
    isVerifiedPurchase: !!hasPurchased
  });

  return res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, review, "Review added"));
});

/**
 * @desc    Delete Review
 * @route   DELETE /api/v1/reviews/:reviewId
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.reviewId, userId: req.user._id });
  if (!review) throw new ApiError(httpStatus.NOT_FOUND, "Review not found");

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, "Review deleted"));
});

/**
 * @desc    Get Public Reviews for a Product
 * @route   GET /api/v1/reviews/:productId
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const reviews = await Review.find({ productId })
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, reviews, "Reviews fetched"));
});