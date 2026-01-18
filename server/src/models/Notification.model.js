import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Can be User or Seller (via User ID)
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["order_update", "promotion", "system", "alert"],
      default: "system"
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    data: {
      type: Object // Link to OrderID or ProductID
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Auto-delete notifications older than 30 days (TTL Index)
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Notification = mongoose.model("Notification", notificationSchema);