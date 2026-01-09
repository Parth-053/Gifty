import { getSellerStats } from "../../services/seller.service.js";
import { getEntityAnalytics } from "../../services/analytics.service.js";
import Seller from "../../models/seller.model.js";
import Product from "../../models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import ApiError from "../../utils/apiError.js";
import { httpStatus } from "../../utils/constants.js";

const getSellerId = async (userId) => {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new ApiError(httpStatus.FORBIDDEN, "Seller profile not found");
  return seller._id;
};

/**
 * @desc    Dashboard Overview (Cards)
 * @route   GET /api/v1/sellers/analytics/overview
 */
export const getSellerDashboardStats = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);
  
  // 1. Get Aggregate Stats (Service logic)
  const stats = await getSellerStats(sellerId);

  // 2. Get Top Performing Products
  const topProducts = await Product.find({ sellerId })
    .sort({ stock: 1 }) // Example: Low stock warning
    .limit(5)
    .select("name price stock images");

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, { ...stats, topProducts }, "Stats fetched"));
});

/**
 * @desc    Graph Data (Views vs Sales)
 * @route   GET /api/v1/sellers/analytics/graph
 */
export const getSellerGraphData = asyncHandler(async (req, res) => {
  const sellerId = await getSellerId(req.user._id);
  const { range = 30 } = req.query; // Days

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(range));

  // Fetch analytics using the Seller ID as entity
  // (Assuming you track analytics against Seller ID too, or aggregate product analytics)
  // For simplicity, we fetch Product Analytics for all products owned by Seller
  const myProducts = await Product.find({ sellerId }).select("_id");
  
  // This part requires complex aggregation in analytics service to sum up all product views per day.
  // For MVP, we return a placeholder or implement specific 'seller' entity tracking in analytics.service
  
  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, [], "Graph data ready (Implementing aggregation)"));
});