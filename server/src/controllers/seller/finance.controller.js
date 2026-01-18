import Order from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

// Platform Commission Rate (5%)
const COMMISSION_RATE = 0.05; 

/**
 * @desc    Get Seller Financial Stats (Gross, Net, Balance)
 * @route   GET /api/v1/seller/finance/stats
 */
export const getFinanceStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // 1. Aggregation to get Gross Totals
  const stats = await Order.aggregate([
    {
      $match: {
        "items.sellerId": sellerId,
        orderStatus: { $ne: "cancelled" } 
      }
    },
    { $unwind: "$items" },
    {
      $match: {
        "items.sellerId": sellerId
      }
    },
    {
      $group: {
        _id: null,
        // Total value of goods sold by this seller
        grossSales: { 
          $sum: { $multiply: ["$items.price", "$items.quantity"] } 
        },
        itemsSold: { $sum: "$items.quantity" },
        // Amount stuck in non-delivered orders
        pendingGross: {
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

  const data = stats[0] || { grossSales: 0, itemsSold: 0, pendingGross: 0 };

  // 2. Calculate Commission & Net Earnings
  const platformFee = Math.round(data.grossSales * COMMISSION_RATE);
  const netEarnings = data.grossSales - platformFee;

  // Calculate Pending part of Net Earnings
  const pendingPlatformFee = Math.round(data.pendingGross * COMMISSION_RATE);
  const pendingNet = data.pendingGross - pendingPlatformFee;

  // 3. Final Available Balance (Released Net Amount)
  const availableBalance = netEarnings - pendingNet;

  return res.status(200).json(new ApiResponse(200, {
    grossSales: data.grossSales,       // Total Sales (User Paid)
    platformFee,                       // Our Commission (5%)
    netEarnings,                       // Seller's Total Share
    pendingAmount: pendingNet,         // Money not yet released
    availableBalance,                  // Ready to withdraw
    itemsSold: data.itemsSold
  }, "Financial stats calculated successfully"));
});

/**
 * @desc    Get Transaction History (With Commission Breakdown)
 * @route   GET /api/v1/seller/finance/transactions
 */
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // 1. Fetch raw orders
  const orders = await Order.find({
    "items.sellerId": req.user._id
  })
  .select("orderId items orderStatus createdAt") // Only needed fields
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(Number(limit));

  const totalDocs = await Order.countDocuments({ "items.sellerId": req.user._id });

  // 2. Process each order to calculate Seller's specific share
  const transactions = orders.map(order => {
    // Filter items belonging to this seller
    const myItems = order.items.filter(item => 
      item.sellerId.toString() === req.user._id.toString()
    );

    // Calculate totals for this specific order
    const sellerGross = myItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const commission = Math.round(sellerGross * COMMISSION_RATE);
    const netPayout = sellerGross - commission;

    return {
      _id: order._id,
      orderId: order.orderId,
      date: order.createdAt,
      status: order.orderStatus, // delivered, processing, etc.
      grossAmount: sellerGross,
      commission: commission,
      netAmount: netPayout // This is what seller actually gets
    };
  });

  return res.status(200).json(new ApiResponse(200, {
    transactions,
    total: totalDocs,
    page: Number(page),
    pages: Math.ceil(totalDocs / limit)
  }, "Transaction history fetched"));
});

/**
 * @desc    Request Payout (Withdrawal)
 * @route   POST /api/v1/seller/finance/withdraw
 */
export const requestPayout = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  
  if (!amount || amount < 500) {
    return res.status(400).json({ success: false, message: "Minimum withdrawal amount is ₹500" });
  }

  // Mock Success Response
  return res.status(200).json(new ApiResponse(200, {
    requestId: "REQ-" + Date.now(),
    amount,
    status: "pending",
    message: "Withdrawal request submitted. It will be processed within 24-48 hours."
  }, "Payout requested"));
});