import Order from "../../models/Order.model.js";
import { Transaction } from "../../models/Transaction.model.js"; 
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

/**
 * @desc    Get Seller Financial Stats (Total Earnings, Balance)
 * @route   GET /api/v1/seller/finance/stats
 */
export const getFinanceStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // 1. Calculate Total Revenue & Pending Payments via Aggregation
  const stats = await Order.aggregate([
    {
      $match: {
        "items.sellerId": sellerId, // Filter orders containing this seller's products
        // We only count orders that are not cancelled
        orderStatus: { $ne: "cancelled" } 
      }
    },
    { $unwind: "$items" }, // Break down arrays to process individual items
    {
      $match: {
        "items.sellerId": sellerId
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { 
          $sum: { $multiply: ["$items.price", "$items.quantity"] } 
        },
        itemsSold: { $sum: "$items.quantity" },
        pendingAmount: {
          $sum: {
            $cond: [
              { $ne: ["$orderStatus", "delivered"] }, 
              { $multiply: ["$items.price", "$items.quantity"] }, 
              0
            ]
          }
        }
      }
    }
  ]);

  const data = stats[0] || { totalRevenue: 0, itemsSold: 0, pendingAmount: 0 };
  
  // Available for withdrawal = Total - Pending
  const availableBalance = data.totalRevenue - data.pendingAmount;

  return res.status(200).json(new ApiResponse(200, {
    ...data,
    availableBalance
  }, "Financial stats fetched"));
});

/**
 * @desc    Get Transaction History (Orders & Payouts)
 * @route   GET /api/v1/seller/finance/transactions
 */
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Fetch orders related to this seller to show as "Credits"
  // Note: For a real payout system, you would have a separate Payout model.
  // Here we return the recent orders as the transaction history source.
  
  const transactions = await Order.find({
    "items.sellerId": req.user._id
  })
  .select("orderId totalAmount paymentMethod orderStatus createdAt")
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(Number(limit));

  const total = await Order.countDocuments({ "items.sellerId": req.user._id });

  return res.status(200).json(new ApiResponse(200, {
    transactions,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  }, "Transaction history fetched"));
});

/**
 * @desc    Request Payout (Withdrawal)
 * @route   POST /api/v1/seller/finance/withdraw
 */
export const requestPayout = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Logic: 
  // 1. Check Available Balance (Reuse logic from getFinanceStats)
  // 2. If Balance > amount, create Payout Request
  // 3. Since we didn't create a Payout Model in Step 2, we will return a mock success
  //    In a real app, create a 'Payout' document here.

  if (!amount || amount < 500) {
    // Minimum withdrawal limit
    return res.status(400).json({ success: false, message: "Minimum withdrawal amount is ₹500" });
  }

  // Mock Success Response for now
  return res.status(200).json(new ApiResponse(200, {
    requestId: "PAY-" + Date.now(),
    amount,
    status: "pending",
    message: "Withdrawal request submitted successfully. Admin will process it shortly."
  }, "Payout requested"));
});