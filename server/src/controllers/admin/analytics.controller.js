import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import * as dashboardService from "../../services/dashboard.service.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Admin Dashboard Stats (Cards)
 * @route   GET /api/v1/admin/analytics/dashboard
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Use the service we created earlier
  const stats = await dashboardService.getStats();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, stats, "Dashboard stats fetched successfully"));
});

/**
 * @desc    Get Sales Graph Data
 * @route   GET /api/v1/admin/analytics/graph
 */
export const getSalesGraph = asyncHandler(async (req, res) => {
  const chartData = await dashboardService.getSalesChart();

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, chartData, "Sales graph data fetched successfully"));
});