import { Order } from "../../models/Order.model.js";
import { Payout } from "../../models/Payout.model.js";
import { SystemSetting } from "../../models/SystemSetting.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Transactions (Admin View)
 * @route   GET /api/v1/admin/finance/transactions
 */
export const getAllTransactions = asyncHandler(async (req, res) => {
  const settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });
  const sellerCommissionRate = settings?.sellerCommission || 0;

  const features = new ApiFeatures(
    Order.find({ orderStatus: "delivered" }).populate("userId", "fullName email"),
    req.query
  )
  .filter()
  .sort()
  .paginate();

  const orders = await features.query;
  const total = await Order.countDocuments({ orderStatus: "delivered" });

  const transactions = orders.map(order => {
    // Revenue Logic
    const buyerFee = order.platformFee || 0;
    const sellerCommission = (order.totalAmount * sellerCommissionRate) / 100;
    const adminRevenue = buyerFee + sellerCommission;

    return {
      _id: order._id,
      transactionId: order.paymentInfo?.razorpayPaymentId || order.orderId,
      date: order.createdAt,
      user: order.userId?.fullName || "Guest",
      orderAmount: order.totalAmount,     // Product Cost
      buyerFee: buyerFee,                 // Extra Fee
      adminRevenue: adminRevenue,         // Your Profit
      status: "Completed"
    };
  });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { transactions, total }, "All transactions fetched"));
});

/**
 * @desc    Get All Payout Requests
 * @route   GET /api/v1/admin/finance/payouts
 */
export const getAllPayouts = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(
    Payout.find().populate("sellerId", "storeName email"),
    req.query
  )
  .filter()
  .sort()
  .paginate();

  const payouts = await features.query;
  const total = await Payout.countDocuments();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { payouts, total }, "Payout requests fetched"));
});