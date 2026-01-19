import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    payoutId: { type: String, required: true, unique: true }, // PO-9921
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed"],
      default: "Pending"
    },
    transactionDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: "Bank Transfer" }
  },
  { timestamps: true }
);

export const Payout = mongoose.model("Payout", payoutSchema);