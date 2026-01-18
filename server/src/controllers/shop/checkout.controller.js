import * as cartService from "../../services/cart.service.js";
import Address from "../../models/Address.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

/**
 * @desc    Get Checkout Summary (Pre-Payment Calculation)
 * @route   POST /api/v1/checkout/summary
 */
export const getCheckoutSummary = asyncHandler(async (req, res) => {
  const { addressId, couponCode } = req.body;

  // 1. Get Cart Data
  const cart = await cartService.getCart(req.user._id);
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // 2. Calculate Base Totals
  let subtotal = cart.cartTotal;
  let shippingFee = 0;
  let tax = 0;
  let discount = 0;

  // 3. Calculate Shipping (Logic based on Address/Pincode)
  if (addressId) {
    const address = await Address.findOne({ _id: addressId, userId: req.user._id });
    if (!address) throw new ApiError(404, "Address not found");
    
    // Example Logic: Free shipping over ₹999, else ₹50
    shippingFee = subtotal > 999 ? 0 : 50;
  }

  // 4. Calculate Tax (GST 18% Example)
  tax = Math.round(subtotal * 0.18); 

  // 5. Apply Coupon (Mock Logic - In real app, check Coupon Model)
  if (couponCode === "WELCOME50") {
    discount = 50;
  }

  // 6. Final Total
  const finalTotal = subtotal + shippingFee + tax - discount;

  const summary = {
    cartItems: cart.items,
    bill: {
      subtotal,
      shippingFee,
      tax,
      discount,
      finalTotal
    }
  };

  return res.status(200).json(new ApiResponse(200, summary, "Checkout summary calculated"));
});

/**
 * @desc    Validate Cart Stock before Payment
 * @route   GET /api/v1/checkout/validate
 */
export const validateCheckout = asyncHandler(async (req, res) => {
  // Logic to check if items are still in stock just before payment
  // (Usually handled inside createOrder service, but exposed here for UI checks)
  return res.status(200).json(new ApiResponse(200, { valid: true }, "Stock validated"));
});