import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as cartService from "../../services/cart.service.js";
import * as couponService from "../../services/coupon.service.js";
import { Address } from "../../models/Address.model.js";
import { httpStatus } from "../../constants/httpStatus.js";
import { TAX } from "../../constants/system.js";

/**
 * @desc    Get Checkout Summary (Bill Calculation)
 * @route   POST /api/v1/shop/checkout/summary
 */
export const getCheckoutSummary = asyncHandler(async (req, res) => {
  const { addressId, couponCode } = req.body;
  const userId = req.user._id;

  // 1. Get Cart
  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // 2. Base Calculations
  let subtotal = cart.cartTotal;
  let taxAmount = Math.round(subtotal * (TAX.DEFAULT_GST_PERCENTAGE / 100));
  let shippingFee = 0;
  let discountAmount = 0;
  let couponApplied = null;

  // 3. Calculate Shipping (Logic: Free above ₹1000)
  if (subtotal < 1000) {
    shippingFee = 50; 
  }

  // 4. Apply Coupon (If provided)
  if (couponCode) {
    const couponResult = await couponService.applyCoupon(couponCode, subtotal, userId);
    discountAmount = couponResult.discountAmount;
    couponApplied = couponResult.code;
  }

  // 5. Final Total
  const totalAmount = subtotal + taxAmount + shippingFee - discountAmount;

  const summary = {
    items: cart.items,
    bill: {
      subtotal,
      taxAmount,
      shippingFee,
      discountAmount,
      totalAmount,
      couponApplied
    },
    shippingAddress: null
  };

  // 6. Attach Address if provided
  if (addressId) {
    const address = await Address.findOne({ _id: addressId, ownerId: userId });
    if (address) summary.shippingAddress = address;
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, summary, "Checkout summary calculated"));
});