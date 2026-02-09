import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js"; 
import { httpStatus } from "../../constants/httpStatus.js";
import { Order } from "../../models/Order.model.js";
import { Product } from "../../models/Product.model.js";

// --- Helper: Get Date Ranges ---
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
    case "month":
      start.setMonth(now.getMonth(), 1);
      start.setHours(0,0,0,0);
      prevStart.setMonth(now.getMonth() - 1, 1);
      prevEnd.setMonth(now.getMonth(), 0);
      break;
    case "year":
      start.setFullYear(now.getFullYear(), 0, 1);
      start.setHours(0,0,0,0);
      prevStart.setFullYear(now.getFullYear() - 1, 0, 1);
      prevEnd.setFullYear(now.getFullYear() - 1, 11, 31);
      break;
    case "all":
    default:
      start = new Date(0); 
      prevStart = new Date(0); 
      break;
  }
  return { start, end, prevStart, prevEnd };
};

// --- Helper: Calculate Percentage Growth ---
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / previous) * 100).toFixed(1);
};

/**
 * @desc    Get Seller Dashboard Stats (Dynamic Time Range)
 * @route   GET /api/v1/seller/dashboard/stats?timeRange=week
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;
  const { timeRange = "week" } = req.query; // Default to week
  const { start, end, prevStart, prevEnd } = getDateRange(timeRange);

  // 1. Current Period Stats
  const currentStats = await Order.aggregate([
    { 
      $match: { 
        "items.sellerId": sellerId, 
        createdAt: { $gte: start, $lte: end }, 
        orderStatus: { $nin: ["cancelled", "returned"] } 
      } 
    },
    { 
      $group: { 
        _id: null, 
        revenue: { $sum: "$totalAmount" }, 
        count: { $sum: 1 } 
      } 
    }
  ]);

  // 2. Previous Period Stats (Comparison)
  const prevStats = await Order.aggregate([
    { 
      $match: { 
        "items.sellerId": sellerId, 
        createdAt: { $gte: prevStart, $lte: prevEnd }, 
        orderStatus: { $nin: ["cancelled", "returned"] } 
      } 
    },
    { 
      $group: { 
        _id: null, 
        revenue: { $sum: "$totalAmount" }, 
        count: { $sum: 1 } 
      } 
    }
  ]);

  // 3. Totals (For Product/Customer counts usually static or all-time)
  const totalProducts = await Product.countDocuments({ 
    seller: sellerId,
    createdAt: { $gte: start, $lte: end } // Optional: Filter new products by date
  });
  
  const distinctCustomers = await Order.distinct("user", { 
    "items.sellerId": sellerId,
    createdAt: { $gte: start, $lte: end }
  });

  // Extract Values
  const curRev = currentStats[0]?.revenue || 0;
  const prevRev = prevStats[0]?.revenue || 0;
  const curOrd = currentStats[0]?.count || 0;
  const prevOrd = prevStats[0]?.count || 0;

  const stats = {
    revenue: {
      value: curRev,
      growth: calculateGrowth(curRev, prevRev),
      isPositive: curRev >= prevRev
    },
    orders: {
      value: curOrd,
      growth: calculateGrowth(curOrd, prevOrd),
      isPositive: curOrd >= prevOrd
    },
    products: {
      value: totalProducts,
      growth: 0, // Simplified for products
      isPositive: true
    },
    customers: {
      value: distinctCustomers.length,
      growth: 0,
      isPositive: true
    }
  };

  // 4. Recent Orders (Always show latest regardless of filter, or filter them too)
  const recentOrders = await Order.find({ "items.sellerId": sellerId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "fullName email")
    .select("_id totalAmount orderStatus createdAt user")
    .lean();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { stats, recentOrders }, "Stats fetched"));
});

/**
 * @desc    Get Sales Chart Data (Dynamic Time Range)
 * @route   GET /api/v1/seller/dashboard/chart?timeRange=week
 */
export const getDashboardChart = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;
  const { timeRange = "week" } = req.query;
  const { start, end } = getDateRange(timeRange);

  // Determine grouping format based on range
  let dateFormat = "%Y-%m-%d"; // Default: Daily
  if (timeRange === "today" || timeRange === "yesterday") {
    dateFormat = "%H:00"; // Hourly
  } else if (timeRange === "year" || timeRange === "all") {
    dateFormat = "%Y-%m"; // Monthly
  }

  const chartData = await Order.aggregate([
    { 
      $match: { 
        "items.sellerId": sellerId, 
        createdAt: { $gte: start, $lte: end },
        orderStatus: { $nin: ["cancelled", "returned"] } 
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Note: For a perfect chart, you might want to fill in missing gaps (empty hours/days)
  // But for now, returning the raw aggregated data is sufficient for Recharts.
  
  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, chartData, "Chart data fetched"));
});