import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true
    },
    images: [{ url: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    
    // Admin Moderation
    isHidden: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

// Prevent duplicate reviews from same user on same product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);