import { Notification } from "../../models/Notification.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpStatus } from "../../constants/httpStatus.js";

/**
 * @desc    Get Notifications (Polymorphic: Admin, Seller, User)
 * @route   GET /api/v1/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  let query = {};

  // 1. If Admin, fetch role-based notifications
  if (req.role === "admin") {
    query = { role: "admin" };
  } 
  // 2. If Seller or User, fetch by specific recipient ID
  else {
    const userId = req.user?._id || req.seller?._id;
    query = { recipient: userId };
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, { notifications, unreadCount }, "Notifications fetched"));
});

/**
 * @desc    Mark All as Read
 * @route   PATCH /api/v1/notifications/read-all
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  let query = {};

  if (req.role === "admin") {
    query = { role: "admin", isRead: false };
  } else {
    const userId = req.user?._id || req.seller?._id;
    query = { recipient: userId, isRead: false };
  }

  await Notification.updateMany(query, { isRead: true });

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "All notifications marked as read"));
});

/**
 * @desc    Delete Notification
 * @route   DELETE /api/v1/notifications/:id
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // For admin, we might allow deleting by ID without strict recipient check, 
  // or check if it matches the role. Keeping it simple here:
  await Notification.findByIdAndDelete(id);

  return res
    .status(httpStatus.OK)
    .json(new ApiResponse(httpStatus.OK, {}, "Notification deleted"));
});