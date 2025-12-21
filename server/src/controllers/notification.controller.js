import Notification from "../models/Notification.model.js";

/* =========================
   GET MY NOTIFICATIONS
   ========================= */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   MARK AS READ
   ========================= */
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CREATE (SYSTEM / ORDER USE)
   ========================= */
export const createNotification = async ({
  userId,
  title,
  message,
  type = "system",
}) => {
  await Notification.create({
    userId,
    title,
    message,
    type,
  });
};
