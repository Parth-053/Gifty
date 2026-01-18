import mongoose from "mongoose";

// Item Schema (Snapshot of product at time of purchase)
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
  
  // Customization Data
  customization: { 
    text: String,
    image: String,
    color: String,
    note: String
  }, 
  
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true, index: true }, // ORD-8273
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    
    items: [orderItemSchema],
    
    totalAmount: { type: Number, required: true },
    shippingAmount: { type: Number, default: 0 },
    
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
      status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
    },

    orderStatus: { // Aggregate Status
        type: String,
        enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
        default: "placed",
        index: true
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;