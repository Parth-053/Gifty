import Order from "../../models/Order.model.js";
import { User } from "../../models/User.model.js";
import { Seller } from "../../models/seller.model.js";
import { Product } from "../../models/Product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

/**
 * @desc    Get Admin Dashboard Stats (Cards)
 * @route   GET /api/v1/admin/analytics/dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Run queries in parallel for performance
  const [totalUsers, totalSellers, totalOrders, totalProducts, revenueStats] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Seller.countDocuments({ status: "approved" }),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ])
  ]);

  const totalRevenue = revenueStats[0]?.total || 0;

  return res.status(200).json(new ApiResponse(200, {
    totalUsers,
    totalSellers,
    totalOrders,
    totalProducts,
    totalRevenue
  }, "Dashboard stats fetched"));
});

/**
 * @desc    Get Sales Graph Data (Last 6 Months)
 * @route   GET /api/v1/admin/analytics/graph
 */
export const getSalesGraph = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" }, // Group by Month
        totalSales: { $sum: "$totalAmount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } } // Sort by month (Jan to Dec)
  ]);

  // Transform data for Frontend Chart (e.g., [1000, 2000, 1500...])
  const formattedData = salesData.map(item => ({
    month: item._id, // 1 = Jan, 2 = Feb
    sales: item.totalSales,
    orders: item.count
  }));

  return res.status(200).json(new ApiResponse(200, formattedData, "Graph data fetched"));
});