import { Notification } from "../../models/Notification.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get My Notifications
 * @route   GET /api/v1/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  // Works for both User (req.user) and Seller (req.seller)
  const ownerId = req.user?._id || req.seller?._id;

  const notifications = await Notification.find({ userId: ownerId })
    .sort({ createdAt: -1 })
    .limit(20);

  // Mark as read immediately upon fetching (or use separate endpoint)
  await Notification.updateMany(
    { userId: ownerId, isRead: false },
    { isRead: true }
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, notifications, "Notifications fetched"));
});