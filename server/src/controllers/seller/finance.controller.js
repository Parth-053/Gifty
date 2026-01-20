import Order from "../../models/Order.model.js";
import { Payout } from "../../models/Payout.model.js";  
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

const COMMISSION_RATE = 0.05; // 5% Platform Fee

/**
 * @desc    Get Seller Financial Stats for Dashboard
 */
export const getFinanceStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const stats = await Order.aggregate([
    { $match: { "items.sellerId": sellerId, orderStatus: { $ne: "cancelled" } } },
    { $unwind: "$items" },
    { $match: { "items.sellerId": sellerId } },
    {
      $group: {
        _id: null,
        grossSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        itemsSold: { $sum: "$items.quantity" },
        pendingAmount: {
          $sum: {
            $cond: [{ $ne: ["$orderStatus", "delivered"] }, { $multiply: ["$items.price", "$items.quantity"] }, 0]
          }
        }
      }
    }
  ]);

  const result = stats[0] || { grossSales: 0, itemsSold: 0, pendingAmount: 0 };
  const netEarnings = Math.round(result.grossSales * (1 - COMMISSION_RATE));

  return res.status(200).json(
    new ApiResponse(200, { ...result, netEarnings }, "Finance stats fetched")
  );
});

/**
 * @desc    Get Transaction History 
 * @route   GET /api/v1/seller/finance/transactions
 */
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // Logic: Orders ko as transactions treat karke fetch karna
  const transactions = await Order.find({
    "items.sellerId": sellerId,
    orderStatus: "delivered"
  }).select("orderId items totalAmount createdAt orderStatus");

  return res.status(200).json(
    new ApiResponse(200, transactions, "Transaction history fetched")
  );
});

/**
 * @desc    Request Payout
 */
export const requestPayout = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 500) {
    throw new ApiError(400, "Minimum withdrawal amount is ₹500");
  }

  const payoutRequest = await Payout.create({
    sellerId: req.user._id,
    amount,
    status: "pending",
    requestDate: new Date()
  });

  return res.status(201).json(
    new ApiResponse(201, payoutRequest, "Withdrawal request submitted")
  );
});

/**
 * @desc    Get Payout History
 */
export const getPayoutHistory = asyncHandler(async (req, res) => {
  const payouts = await Payout.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, payouts, "Payout history fetched"));
});