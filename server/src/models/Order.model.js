import mongoose from "mongoose";

// Sub-schema for items (Embedded directly)
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  // Snapshot: Product name at the time of purchase
  nameSnapshot: {
    type: String,
    required: true
  },
  // Snapshot: Price at the time of purchase
  priceSnapshot: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // Customization data specific to this item
  selectedCustomizations: {
    type: Object,
    default: {} 
  }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Address snapshot (frozen at checkout)
    addressSnapshot: {
      type: Object,
      required: true
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true
    },

    orderStatus: {
      type: String,
      enum: ["placed", "packed", "shipped", "delivered", "cancelled"],
      default: "placed",
      index: true
    },

    trackingId: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, orderStatus: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;