import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema(
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
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        reason: { type: String, required: true },  
        images: [{ url: String }]  
      }
    ],
    
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Refunded"],
      default: "Pending",
      index: true
    },
    
    refundAmount: { type: Number, required: true },
    
    // Admin or Seller comments
    adminNote: { type: String },
    
    // Refund Transaction Link
    refundTransactionId: { type: String } 
  },
  { timestamps: true }
);

export const ReturnRequest = mongoose.model("ReturnRequest", returnRequestSchema);