import mongoose from "mongoose";

// Embedded Schema for Order Items (Snapshot logic)
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },  
  image: { type: String, required: true },
  
  quantity: { type: Number, required: true, min: 1 },
  
  //Dynamic Customization Handling
  customizationDetails: [
    {
      optionName: { type: String, required: true },  
      type: { type: String, default: "text" },     
      value: { type: String, required: true },     
      additionalPrice: { type: Number, default: 0 }  
    }
  ],
  
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
    default: "pending"
  }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true, index: true },  
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    
    items: [orderItemSchema],
    
    totalAmount: { type: Number, required: true },
    shippingAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },  
    
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true
    },
    
    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" }
    },

    // Global Order Status
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
      index: true
    },
    
    trackingId: { type: String },
    courierPartner: { type: String }
  },
  { timestamps: true }
);

// Index for sorting orders by date (Dashboard)
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);