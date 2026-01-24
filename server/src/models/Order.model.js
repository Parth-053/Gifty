import mongoose from "mongoose";

// Order Item Schema
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
  customizationDetails: [
    {
      optionName: String,  
      type: String,     
      value: String,     
      additionalPrice: { type: Number, default: 0 }  
    }
  ],
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
    default: "pending"
  }
}, { _id: false });

// Main Order Schema
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
    
    totalAmount: { type: Number, required: true }, // Sum of items (1000)
    shippingAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    
    platformFee: { type: Number, default: 0 }, 

    finalAmount: { type: Number, required: true }, // 1008
    
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      city: String,
      state: String,
      pincode: String,
      phone: String
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

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);