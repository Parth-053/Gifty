import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { User } from "../models/User.model.js";

/**
 * Get Admin/Seller Stats (Cards)
 * @param {String} sellerId - Optional (If provided, filters for that seller)
 */
export const getStats = async (sellerId = null) => {
  const filter = sellerId ? { "items.sellerId": sellerId } : {};
  
  // 1. Total Sales & Revenue
  const salesStats = await Order.aggregate([
    { $match: { ...filter, orderStatus: { $nin: ["cancelled", "returned"] } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  // 2. Total Products
  const productCount = await Product.countDocuments(sellerId ? { sellerId } : {});

  // 3. Total Users (Admin Only)
  const userCount = sellerId ? 0 : await User.countDocuments({ role: "user" });

  return {
    totalRevenue: salesStats[0]?.totalRevenue || 0,
    totalOrders: salesStats[0]?.totalOrders || 0,
    totalProducts: productCount,
    totalUsers: userCount
  };
};

/**
 * Get Sales Chart Data (Last 7 Days)
 */
export const getSalesChart = async (sellerId = null) => {
  const filter = sellerId ? { "items.sellerId": sellerId } : {};
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const chartData = await Order.aggregate([
    { 
      $match: { 
        ...filter, 
        createdAt: { $gte: sevenDaysAgo },
        orderStatus: { $nin: ["cancelled", "returned"] }
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        dailyRevenue: { $sum: "$totalAmount" },
        dailyOrders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } } // Sort by date ascending
  ]);

  return chartData;
};

/**
 * Get Top Selling Products
 */
export const getTopProducts = async (sellerId = null, limit = 5) => {
    // Note: This requires unwinding items, which can be heavy. 
    // For MVP, we can keep it simple or implement if needed.
    return []; 
};