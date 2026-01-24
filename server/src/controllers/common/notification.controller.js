import { Notification } from "../../models/Notification.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get All Notifications
 * @route   GET /api/v1/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  // Works for User, Seller, and Admin (whoever is logged in)
  const userId = req.user?._id || req.seller?._id;

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50); // Increased limit for admin

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { notifications, unreadCount }, "Notifications fetched"));
});

/**
 * @desc    Mark All as Read
 * @route   PATCH /api/v1/notifications/read
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.seller?._id;

  await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "All notifications marked as read"));
});

/**
 * @desc    Delete a Notification
 * @route   DELETE /api/v1/notifications/:id
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id || req.seller?._id;

  const notification = await Notification.findOneAndDelete({ _id: id, userId });

  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  }

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Notification deleted"));
});