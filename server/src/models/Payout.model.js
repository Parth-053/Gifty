import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    payoutId: { type: String, required: true, unique: true }, 
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed"],
      default: "Pending",
      index: true
    },
    transactionDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: "Bank Transfer" },
    referenceId: { type: String }  
  },
  { timestamps: true }
);

export const Payout = mongoose.model("Payout", payoutSchema);