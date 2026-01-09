import Analytics from "../models/analytics.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import { httpStatus } from "../utils/constants.js";

/**
 * Helper: Normalize date to start of day (UTC Midnight)
 * Ensures all events for the same day hit the same document.
 */
const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Track an event (View or Click)
 * Efficiently increments counters using atomic operators.
 * @param {String} entityType - "product" or "seller"
 * @param {String} entityId
 * @param {String} metricType - "views" or "clicks"
 */
export const trackEvent = async (entityType, entityId, metricType) => {
  const today = getStartOfDay();

  // Validate metric type to prevent injection of random fields
  const allowedMetrics = ["views", "clicks"];
  if (!allowedMetrics.includes(metricType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid metric type");
  }

  // Atomic Update (Upsert)
  // If doc exists for today -> Increment count
  // If not -> Create doc and set count to 1
  await Analytics.findOneAndUpdate(
    { 
      entityType, 
      entityId, 
      date: today 
    },
    { 
      $inc: { [metricType]: 1 } 
    },
    { 
      upsert: true, 
      new: true,
      setDefaultsOnInsert: true 
    }
  );
  
  return true;
};

/**
 * Track Revenue/Purchase (Called after successful order)
 * @param {String} productId
 * @param {Number} amount - The price the item sold for
 * @param {Number} quantity - Qty sold
 */
export const trackPurchase = async (productId, amount, quantity) => {
  const today = getStartOfDay();
  const revenue = amount * quantity;

  await Analytics.findOneAndUpdate(
    {
      entityType: "product",
      entityId: productId,
      date: today
    },
    {
      $inc: { 
        purchases: quantity,
        revenueGenerated: revenue
      }
    },
    { upsert: true, setDefaultsOnInsert: true }
  );

  return true;
};

/**
 * Get Analytics for a specific entity over a date range
 * Useful for Seller Dashboard Graphs
 * @param {String} entityId
 * @param {String} entityType
 * @param {Date} startDate
 * @param {Date} endDate
 */
export const getEntityAnalytics = async (entityId, entityType, startDate, endDate) => {
  // Aggregate daily data to return a time-series array
  const stats = await Analytics.aggregate([
    {
      $match: {
        entityType,
        entityId: new mongoose.Types.ObjectId(entityId),
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $sort: { date: 1 } // Sort chronological for graphs
    },
    {
      $project: {
        date: 1,
        views: 1,
        clicks: 1,
        purchases: 1,
        revenueGenerated: 1,
        _id: 0
      }
    }
  ]);

  // Calculate totals
  const summary = stats.reduce((acc, curr) => ({
    totalViews: acc.totalViews + (curr.views || 0),
    totalClicks: acc.totalClicks + (curr.clicks || 0),
    totalRevenue: acc.totalRevenue + (curr.revenueGenerated || 0),
    totalSales: acc.totalSales + (curr.purchases || 0)
  }), { totalViews: 0, totalClicks: 0, totalRevenue: 0, totalSales: 0 });

  return { timeSeries: stats, summary };
};

/**
 * Get Top Trending Products (Based on Views or Sales)
 * Used for "Popular on Gifty" section
 * @param {String} metric - 'views', 'purchases', or 'revenueGenerated'
 * @param {Number} limit - How many to fetch
 */
export const getTrendingProducts = async (metric = "views", limit = 10) => {
  // We look at the last 7 days for "Trending"
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const trending = await Analytics.aggregate([
    {
      $match: {
        entityType: "product",
        date: { $gte: getStartOfDay(sevenDaysAgo) }
      }
    },
    // Group by Product ID to sum up stats over the last 7 days
    {
      $group: {
        _id: "$entityId",
        totalScore: { $sum: `$${metric}` } // Dynamic field (e.g. $views)
      }
    },
    { $sort: { totalScore: -1 } }, // Descending order
    { $limit: limit },
    // Lookup to get actual product details (Name, Image, Price)
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        _id: 1,
        totalScore: 1,
        name: "$productDetails.name",
        slug: "$productDetails.slug",
        price: "$productDetails.price",
        image: { $arrayElemAt: ["$productDetails.images.url", 0] }
      }
    }
  ]);

  return trending;
};