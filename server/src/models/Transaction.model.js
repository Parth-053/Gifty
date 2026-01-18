import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay", "stripe"],
      required: true
    },
    paymentGatewayId: { 
      type: String, 
      required: true //  razorpay_payment_id
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
      index: true
    },
    metadata: {
      type: Object // Extra details from gateway
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);