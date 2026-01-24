import * as dashboardService from "../../services/dashboard.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Seller Dashboard Stats (Cards)
 * @route   GET /api/v1/seller/dashboard/stats
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;
  const stats = await dashboardService.getStats(sellerId);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, stats, "Dashboard stats fetched"));
});

/**
 * @desc    Get Sales Chart Data
 * @route   GET /api/v1/seller/dashboard/chart
 */
export const getDashboardChart = asyncHandler(async (req, res) => {
  const sellerId = req.seller._id;
  const chartData = await dashboardService.getSalesChart(sellerId);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, chartData, "Sales chart data fetched"));
});