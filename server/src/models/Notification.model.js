import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientModel',  
      index: true
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['User', 'Seller'],  
      default: 'User'
    },
    type: {
      type: String,
      enum: ["order_update", "promotion", "system", "alert"],
      default: "system"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    data: {
      type: Object  
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Auto-delete notifications older than 30 days to save DB space
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Notification = mongoose.model("Notification", notificationSchema);