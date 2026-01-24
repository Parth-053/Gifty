import { Order } from "../../models/Order.model.js";
import { User } from "../../models/User.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { SystemSetting } from "../../models/SystemSetting.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Admin Dashboard Stats
 * @route   GET /api/v1/admin/analytics/dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Fetch Global Settings for Commission Rate
  const settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });
  const sellerCommissionRate = settings?.sellerCommission || 0; // e.g., 5

  // 2. Count Basic Entities
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalSellers = await Seller.countDocuments(); // Count all sellers
  const totalOrders = await Order.countDocuments();

  // 3. Calculate Financials (Revenue)
  // We only count 'delivered' orders as Real Revenue
  const deliveredOrders = await Order.find({ orderStatus: "delivered" });

  let totalRevenue = 0;
  let totalSales = 0;

  deliveredOrders.forEach((order) => {
    // A. Gross Sales (GMV)
    totalSales += order.totalAmount;

    // B. Revenue Calculation
    // Part 1: Fee collected from Buyer (Stored in Order)
    const buyerFee = order.platformFee || 0;

    // Part 2: Commission collected from Seller (Calculated)
    // Note: Ideally commission should be frozen in Order, but using dynamic rate for now
    const sellerCommission = (order.totalAmount * sellerCommissionRate) / 100;

    totalRevenue += buyerFee + sellerCommission;
  });

  const stats = {
    totalUsers,
    totalSellers,
    totalOrders,
    totalSales,   // Gross Merchandise Value (GMV)
    totalRevenue  // Actual Profit (Fees + Commission)
  };

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, stats, "Dashboard stats calculated successfully"));
});

/**
 * @desc    Get Sales Graph Data (Last 7 Days)
 * @route   GET /api/v1/admin/analytics/graph
 */
export const getSalesGraph = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, orders, "Sales graph data fetched"));
});