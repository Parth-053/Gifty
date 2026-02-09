import { Order } from "../../models/Order.model.js";
import { User } from "../../models/User.model.js";
import { Seller } from "../../models/Seller.model.js"; 
import { Product } from "../../models/Product.model.js"; 
import { SystemSetting } from "../../models/SystemSetting.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * Helper: Get Date Ranges for Current and Previous Periods
 */
const getDateRange = (filter) => {
  const now = new Date();
  let start = new Date();
  let end = new Date();
  let prevStart = new Date();
  let prevEnd = new Date();

  switch (filter) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      prevStart.setDate(start.getDate() - 1);
      prevStart.setHours(0, 0, 0, 0);
      prevEnd.setDate(end.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
      break;

    case "yesterday":
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      
      prevStart.setDate(start.getDate() - 1);
      prevStart.setHours(0, 0, 0, 0);
      prevEnd.setDate(end.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
      break;

    case "week":
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      
      prevStart.setDate(start.getDate() - 7);
      prevEnd.setDate(end.getDate() - 7);
      break;

    case "year":
      start.setFullYear(now.getFullYear() - 1);
      
      prevStart.setFullYear(start.getFullYear() - 1);
      prevEnd.setFullYear(end.getFullYear() - 1);
      break;

    case "all":
    default:
      start = new Date(0); 
      prevStart = new Date(0); 
      break;
  }

  return { start, end, prevStart, prevEnd };
};

/**
 * Helper: Calculate Percentage Change
 */
const calculatePercentage = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

/**
 * @desc    Get Admin Dashboard Stats (Dynamic)
 * @route   GET /api/v1/admin/analytics/dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { timeRange = "all" } = req.query;
  const { start, end, prevStart, prevEnd } = getDateRange(timeRange);

  const settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });
  const sellerCommissionRate = settings?.sellerCommission || 0;

  // Helper to fetch stats for a specific date range
  const getStatsForPeriod = async (startDate, endDate) => {
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      orderStatus: { $ne: "cancelled" }
    });

    const orderCount = orders.length;
    let revenue = 0;

    orders.forEach(order => {
      if (order.orderStatus === "delivered") {
         const buyerFee = order.platformFee || 0;
         const sellerCommission = (order.totalAmount * sellerCommissionRate) / 100;
         revenue += (buyerFee + sellerCommission);
      }
    });

    const userCount = await User.countDocuments({
      role: "user",
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const productCount = await Product.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    return { orderCount, revenue, userCount, productCount };
  };

  // 1. Get Current Period Stats
  const currentStats = await getStatsForPeriod(start, end);

  // 2. Get Previous Period Stats (Only if not "all")
  const prevStats = timeRange === "all" ? currentStats : await getStatsForPeriod(prevStart, prevEnd);

  // 3. Construct Response
  const responseData = {
    revenue: {
      value: currentStats.revenue,
      percentage: calculatePercentage(currentStats.revenue, prevStats.revenue),
      isPositive: currentStats.revenue >= prevStats.revenue
    },
    orders: {
      value: currentStats.orderCount,
      percentage: calculatePercentage(currentStats.orderCount, prevStats.orderCount),
      isPositive: currentStats.orderCount >= prevStats.orderCount
    },
    users: {
      value: currentStats.userCount,
      percentage: calculatePercentage(currentStats.userCount, prevStats.userCount),
      isPositive: currentStats.userCount >= prevStats.userCount
    },
    products: {
      value: currentStats.productCount,
      percentage: calculatePercentage(currentStats.productCount, prevStats.productCount),
      isPositive: currentStats.productCount >= prevStats.productCount
    }
  };

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, responseData, "Dashboard stats calculated successfully"));
});

/**
 * @desc    Get Sales Graph Data
 * @route   GET /api/v1/admin/analytics/graph
 */
export const getSalesGraph = asyncHandler(async (req, res) => {
  const { timeRange = "all" } = req.query;
  const { start, end } = getDateRange(timeRange);

  let dateFormat = "%Y-%m-%d"; 
  if (timeRange === "today" || timeRange === "yesterday") {
    dateFormat = "%H:00"; 
  } else if (timeRange === "year" || timeRange === "all") {
    dateFormat = "%Y-%m"; 
  }

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, salesData, "Sales graph data fetched"));
});