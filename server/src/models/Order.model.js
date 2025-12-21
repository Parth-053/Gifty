import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: Number,
    price: Number,

    // 🔐 FINAL CUSTOMIZATION SNAPSHOT
    customizationData: {
      text: String,
      image: String,
      color: String,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [orderItemSchema],

    totalAmount: Number,
    address: Object,

    /* 🔥 PAYMENT INFO (ADD HERE) */
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "COD", // future: Razorpay, UPI, Card
    },
    paymentId: {
      type: String, // Razorpay / Stripe transaction id
    },

    /* 📦 ORDER STATUS */
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
