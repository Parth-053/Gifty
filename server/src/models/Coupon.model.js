import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
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
      type: Number  
    },
    
    // Restrictions
    applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    
    startDate: {
      type: Date,
      default: Date.now
    },
    expirationDate: {
      type: Date,
      required: true,
      index: true  
    },
    usageLimit: {
      type: Number,
      default: 100 
    },
    perUserLimit: {
      type: Number,
      default: 1
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

// Method to check validity
couponSchema.methods.isValid = function () {
  return (
    this.isActive &&
    this.expirationDate > Date.now() &&
    this.usedCount < this.usageLimit
  );
};

export const Coupon = mongoose.model("Coupon", couponSchema);