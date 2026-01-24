import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import * as cartService from "../../services/cart.service.js";
import * as couponService from "../../services/coupon.service.js";
import { Order } from "../../models/Order.model.js";
import { SystemSetting } from "../../models/SystemSetting.model.js";  
import { httpStatus } from "../../constants/httpStatus.js";
import { TAX } from "../../constants/system.js";
import { v4 as uuidv4 } from 'uuid';

export const getCheckoutSummary = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;
  const userId = req.user._id;

  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // 1. Fetch Platform Fee
  const settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });
  const platformFee = settings?.buyerPlatformFee || 0; // e.g., 8

  let subtotal = cart.cartTotal;
  let taxAmount = Math.round(subtotal * (TAX.DEFAULT_GST_PERCENTAGE / 100));
  let shippingFee = subtotal < 1000 ? 50 : 0;
  let discountAmount = 0;
  let couponApplied = null;

  if (couponCode) {
    const couponResult = await couponService.applyCoupon(couponCode, subtotal, userId);
    discountAmount = couponResult.discountAmount;
    couponApplied = couponResult.code;
  }

  // 2. Add Platform Fee to Total
  const totalAmount = subtotal + taxAmount + shippingFee + platformFee - discountAmount;

  const summary = {
    items: cart.items,
    bill: {
      subtotal,
      taxAmount,
      shippingFee,
      platformFee, // Send to frontend
      discountAmount,
      totalAmount,
      couponApplied
    },
    shippingAddress: null
  };

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, summary, "Checkout summary calculated"));
});

export const createOrder = asyncHandler(async (req, res) => {
  const { address, paymentMethod, bill } = req.body;
  const userId = req.user._id;

  const cart = await cartService.getCart(userId);
  if (!cart || cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // 1. Re-fetch Platform Fee (Security)
  const settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });
  const platformFee = settings?.buyerPlatformFee || 0;

  let subtotal = cart.cartTotal;
  let taxAmount = Math.round(subtotal * (TAX.DEFAULT_GST_PERCENTAGE / 100));
  let shippingFee = subtotal < 1000 ? 50 : 0;
  let discountAmount = bill?.discountAmount || 0; 

  // 2. Final Total
  const finalAmount = subtotal + taxAmount + shippingFee + platformFee - discountAmount;

  const order = await Order.create({
    orderId: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
    userId,
    items: cart.items.map(item => ({
      productId: item.productId._id,
      sellerId: item.productId.sellerId,
      name: item.productId.name,
      price: item.price,
      image: item.productId.images[0]?.url,
      quantity: item.quantity,
      customizationDetails: item.customizationDetails
    })),
    totalAmount: subtotal,
    shippingAmount: shippingFee,
    discountAmount: discountAmount,
    platformFee: platformFee, // Stored here
    finalAmount: finalAmount,
    shippingAddress: address,
    paymentMethod,
    paymentInfo: {
      status: 'pending'
    },
    orderStatus: 'placed'
  });

  await cartService.clearCart(userId);

  return res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, order, "Order placed successfully"));
});