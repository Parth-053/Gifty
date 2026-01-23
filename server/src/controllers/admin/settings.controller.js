import { SystemSetting } from "../../models/SystemSetting.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Global Settings
 * @route   GET /api/v1/admin/settings
 */
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await SystemSetting.findOne({ key: "GLOBAL_SETTINGS" });

  if (!settings) {
    // Initialize defaults if not found
    settings = await SystemSetting.create({ key: "GLOBAL_SETTINGS" });
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, settings, "System settings fetched"));
});

/**
 * @desc    Update Global Settings
 * @route   PUT /api/v1/admin/settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const { platformCommission, taxRate, minPayoutAmount, isMaintenanceMode } = req.body;

  const settings = await SystemSetting.findOneAndUpdate(
    { key: "GLOBAL_SETTINGS" },
    {
      platformCommission,
      taxRate,
      minPayoutAmount,
      isMaintenanceMode
    },
    { new: true, upsert: true }
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, settings, "System settings updated"));
});