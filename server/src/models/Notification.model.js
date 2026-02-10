import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
      required: false,  
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"], 
      default: "user"
    },
    type: {
      type: String,
      enum: [
        "ORDER", 
        "SYSTEM", 
        "PROMOTION", 
        "ACCOUNT", 
        "ACCOUNT_STATUS", 
        "INVENTORY", 
        "NEW_USER", 
        "NEW_SELLER",
        "PRODUCT_STATUS" 
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: Object, 
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);