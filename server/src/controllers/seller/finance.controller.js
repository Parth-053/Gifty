import { Payout } from "../../models/Payout.model.js";
import { Order } from "../../models/Order.model.js";
import { SystemSetting } from "../../models/SystemSetting.model.js";  
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
  const stats = await dashboardService.getStats(req.seller._id);
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, stats, "Finance stats fetched successfully"));
});

/**
 * @desc    Get Transaction History
 * @route   GET /api/v1/seller/finance/transactions
 */
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;
  const settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });
  const commissionRate = settings?.sellerCommission || 0;

  const features = new ApiFeatures(
    Order.find({ "items.sellerId": sellerId, orderStatus: "delivered" }), 
    req.query
  ).filter().sort().paginate();

  const orders = await features.query;
  
  const transactions = orders.map(order => {
    const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
    const sellerGrossTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const adminCommission = (sellerGrossTotal * commissionRate) / 100;
    const sellerNetEarning = sellerGrossTotal - adminCommission;

    return {
      transactionId: order.paymentInfo?.razorpayPaymentId || order.orderId,
      date: order.createdAt,
      orderId: order.orderId,
      totalAmount: sellerGrossTotal,
      commissionRate: commissionRate,
      commissionDeducted: adminCommission,
      amount: sellerNetEarning,
      status: "Credit"
    };
  });

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, transactions, "Transaction history fetched"));
});

/**
 * @desc    Get Sales Graph Data (Last 30 Days) 
 * @route   GET /api/v1/seller/finance/graph
 */
export const getSalesGraph = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // MongoDB Aggregation to calculate daily sales for this seller
  const graphData = await Order.aggregate([
    {
      $match: {
        "items.sellerId": sellerId,
        orderStatus: { $ne: "cancelled" },
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    { $unwind: "$items" },
    {
      $match: { "items.sellerId": sellerId }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        dailySales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        orderCount: { $addToSet: "$orderId" } // Count unique orders
      }
    },
    {
      $project: {
        _id: 1,
        sales: "$dailySales",
        orders: { $size: "$orderCount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, graphData, "Graph data fetched"));
});

/**
 * @desc    Request Payout
 * @route   POST /api/v1/seller/finance/payouts
 */
export const requestPayout = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount < 500) throw new ApiError(httpStatus.BAD_REQUEST, "Minimum withdrawal amount is ₹500");

  const existingRequest = await Payout.findOne({ sellerId: req.seller._id, status: "pending" });
  if (existingRequest) throw new ApiError(httpStatus.BAD_REQUEST, "You already have a pending payout request");

  const payout = await Payout.create({
    sellerId: req.seller._id,
    amount,
    status: "pending",
    requestDate: new Date()
  });

  return res.status(httpStatus.CREATED).json(new ApiResponse(httpStatus.CREATED, payout, "Payout request submitted"));
});

/**
 * @desc    Get Payout History
 * @route   GET /api/v1/seller/finance/payouts
 */
export const getPayoutHistory = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Payout.find({ sellerId: req.seller._id }), req.query).filter().sort().paginate();
  const payouts = await features.query;
  const total = await Payout.countDocuments({ sellerId: req.seller._id });

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { payouts, total }, "Payout history fetched"));
});