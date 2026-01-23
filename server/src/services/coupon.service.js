import { Coupon } from "../models/Coupon.model.js";
import { Order } from "../models/Order.model.js"; // To check usage limit
import { ApiError } from "../utils/ApiError.js";

/**
 * Apply Coupon to Cart Total
 */
export const applyCoupon = async (code, cartTotal, userId) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  // 1. Basic Checks
  if (!coupon) throw new ApiError(404, "Invalid Coupon Code");
  
  if (new Date() > coupon.expirationDate) {
    throw new ApiError(400, "Coupon has expired");
  }

  if (cartTotal < coupon.minPurchaseAmount) {
    throw new ApiError(400, `Minimum purchase of ₹${coupon.minPurchaseAmount} required`);
  }

  // 2. Check Usage Limit (Per User)
  // (Assuming we track usedCoupons in Order or User model. Simplified here)
  const userUsage = await Order.countDocuments({ userId, couponId: coupon._id });
  if (userUsage >= 1) { // Limit 1 per user for now
    throw new ApiError(400, "You have already used this coupon");
  }

  // 3. Calculate Discount
  let discountAmount = 0;
  
  if (coupon.discountType === "percentage") {
    discountAmount = (cartTotal * coupon.discountValue) / 100;
    
    // Cap at max discount
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else {
    // Fixed Amount
    discountAmount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed total
  if (discountAmount > cartTotal) discountAmount = cartTotal;

  return {
    couponId: coupon._id,
    code: coupon.code,
    discountAmount: Math.round(discountAmount),
    finalTotal: Math.round(cartTotal - discountAmount)
  };
};