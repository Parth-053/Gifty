import { Router } from "express";
import { trackEvent } from "../services/analytics.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { httpStatus } from "../utils/constants.js";

const router = Router();

// 🔓 Public Endpoint for Tracking Views/Clicks silently
router.post("/track", asyncHandler(async (req, res) => {
  const { entityId, type, metric } = req.body;
  
  // Fire and forget
  trackEvent(type || "product", entityId, metric || "views");

  return res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, {}, "Tracked"));
}));

export default router;