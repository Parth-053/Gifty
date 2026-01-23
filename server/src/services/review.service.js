import { Review } from "../models/Review.model.js";
import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Add Review
 */
export const addReview = async (userId, { productId, rating, comment }) => {
  // 1. Verify Purchase (Must be Delivered)
  const hasPurchased = await Order.findOne({
    userId,
    "items.productId": productId,
    orderStatus: "delivered" // Simplest check
  });

  if (!hasPurchased) {
    throw new ApiError(403, "You can only review products you have purchased and received.");
  }

  // 2. Check for Duplicate
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
  await updateProductRating(productId);

  return review;
};

/**
 * Helper: Recalculate Product Rating
 */
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId: productId } },
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
        average: Math.round(stats[0].averageRating * 10) / 10,
        count: stats[0].numReviews
      }
    });
  }
};