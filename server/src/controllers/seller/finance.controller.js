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
  // Use the shared dashboard service with sellerId
  const stats = await dashboardService.getStats(req.seller._id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, stats, "Finance stats fetched successfully"));
});

/**
 * @desc    Get Transaction History (Sales with Commission Logic)
 * @route   GET /api/v1/seller/finance/transactions
 */
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;

  // 1. Fetch Global Commission Rate from System Settings
  const settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });
  const commissionRate = settings?.sellerCommission || 0; // Default to 0% if not set

  // 2. Fetch Delivered Orders for this Seller
  // We only count 'delivered' orders as valid transactions for payout
  const features = new ApiFeatures(
    Order.find({ "items.sellerId": sellerId, orderStatus: "delivered" }), 
    req.query
  )
  .filter()
  .sort()
  .paginate();

  const orders = await features.query;
  
  // 3. Transform orders into transaction records
  const transactions = orders.map(order => {
    // Filter items belonging to this specific seller
    const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
    
    // Calculate Gross Total for Seller's products (Price * Quantity)
    // IMPORTANT: We do NOT include order.platformFee here because that is the Buyer's fee paid to Admin.
    const sellerGrossTotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Calculate Admin Commission (e.g., 5% of 1000 = 50)
    const adminCommission = (sellerGrossTotal * commissionRate) / 100;
    
    // Calculate Net Earning for Seller (e.g., 1000 - 50 = 950)
    const sellerNetEarning = sellerGrossTotal - adminCommission;

    return {
      transactionId: order.paymentInfo?.razorpayPaymentId || order.orderId,
      date: order.createdAt,
      orderId: order.orderId,
      
      // Financial Breakdown for Frontend Display
      totalAmount: sellerGrossTotal,       // Product Sales Value
      commissionRate: commissionRate,      // Applied Rate
      commissionDeducted: adminCommission, // Deducted Amount
      amount: sellerNetEarning,            // Final Payout Amount (Credit)
      status: "Credit"
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

  // Validate Minimum Amount
  if (!amount || amount < 500) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Minimum withdrawal amount is ₹500");
  }

  // Check for existing pending requests
  const existingRequest = await Payout.findOne({ 
    sellerId: req.seller._id, 
    status: "pending" 
  });

  if (existingRequest) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already have a pending payout request");
  }

  // Create Payout Request
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