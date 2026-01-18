import Review from "../models/Review.model.js";
import { Product } from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Add Review
 */
export const addReview = async (userId, { productId, rating, comment }) => {
  // 1. Check if user actually bought the product
  const hasPurchased = await Order.exists({
    userId,
    "items.productId": productId,
    orderStatus: "delivered"
  });

  if (!hasPurchased) {
    throw new ApiError(403, "You can only review products you have purchased and received.");
  }

  // 2. Check existing review
  const existingReview = await Review.findOne({ userId, productId });
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product.");
  }

  // 3. Create Review
  const review = await Review.create({
    userId,
    productId,
    rating,
    comment,
    isVerifiedPurchase: true
  });

  // 4. Update Product Average Rating (Aggregation)
  const stats = await Review.aggregate([
    { $match: { productId: review.productId } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: {
        average: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
        count: stats[0].numReviews
      }
    });
  }

  return review;
};

/**
 *  Get Product Reviews
 */
export const getProductReviews = async (productId) => {
  return await Review.find({ productId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });
};