import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: String,
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },
    discountValue: {
      type: Number,
      required: true
    },
    minPurchaseAmount: {
      type: Number,
      default: 0
    },
    maxDiscountAmount: {
      type: Number // For percentage based coupons (e.g. 20% off upto ₹500)
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    expirationDate: {
      type: Date,
      required: true
    },
    usageLimit: {
      type: Number,
      default: 100 // Total times this coupon can be used
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Check if coupon is valid
couponSchema.methods.isValid = function () {
  return (
    this.isActive &&
    this.expirationDate > Date.now() &&
    this.usedCount < this.usageLimit
  );
};

export const Coupon = mongoose.model("Coupon", couponSchema);