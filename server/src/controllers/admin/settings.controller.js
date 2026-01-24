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
  // 👇 FIXED: Now accepting distinct values for Buyer and Seller
  const { 
    sellerCommission, 
    buyerPlatformFee, 
    taxRate, 
    minPayoutAmount, 
    isMaintenanceMode 
  } = req.body;

  const settings = await SystemSetting.findOneAndUpdate(
    { key: "GLOBAL_SETTINGS" },
    {
      sellerCommission,   // Save Seller %
      buyerPlatformFee,   // Save Buyer ₹
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