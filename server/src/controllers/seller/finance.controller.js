import { Payout } from "../../models/Payout.model.js";
import { Order } from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import * as dashboardService from "../../services/dashboard.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Seller Financial Stats
 * @route   GET /api/v1/seller/finance/stats
 */
export const getFinanceStats = asyncHandler(async (req, res) => {
  // Use the shared dashboard service with sellerId
  const stats = await dashboardService.getStats(req.seller._id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, stats, "Finance stats fetched successfully"));
});

/**
 * @desc    Get Transaction History (Sales)
 * @route   GET /api/v1/seller/finance/transactions
 */
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;

  // We treat "Delivered Orders" as completed transactions for the seller
  const features = new ApiFeatures(
    Order.find({ "items.sellerId": sellerId, orderStatus: "delivered" }), 
    req.query
  )
  .filter()
  .sort()
  .paginate();

  const orders = await features.query;
  
  // Transform to show only relevant info
  const transactions = orders.map(order => {
    // Calculate seller's share for this specific order
    const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
    const sellerTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return {
      transactionId: order.paymentInfo?.razorpayPaymentId || order.orderId,
      date: order.createdAt,
      amount: sellerTotal,
      status: "Credit", // Sales are credits
      orderId: order.orderId
    };
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, transactions, "Transaction history fetched"));
});

/**
 * @desc    Request Payout
 * @route   POST /api/v1/seller/finance/payouts
 */
export const requestPayout = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 500) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Minimum withdrawal amount is ₹500");
  }

  // Check pending requests
  const existingRequest = await Payout.findOne({ 
    sellerId: req.seller._id, 
    status: "pending" 
  });

  if (existingRequest) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already have a pending payout request");
  }

  const payout = await Payout.create({
    sellerId: req.seller._id,
    amount,
    status: "pending",
    requestDate: new Date()
  });

  return res
    .status(httpStatus.CREATED)
    .json(new ApiResponse(httpStatus.CREATED, payout, "Payout request submitted successfully"));
});

/**
 * @desc    Get Payout History
 * @route   GET /api/v1/seller/finance/payouts
 */
export const getPayoutHistory = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(
    Payout.find({ sellerId: req.seller._id }), 
    req.query
  )
  .filter()
  .sort()
  .paginate();

  const payouts = await features.query;
  const total = await Payout.countDocuments({ sellerId: req.seller._id });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { payouts, total }, "Payout history fetched"));
});