import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  storeName: { type: String, required: true },
  phone: { type: String, required: true },
  gstin: { type: String, default: "" },
  
  // Status Field - This is what the Admin filters by
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "suspended"], 
    default: "pending" 
  },
  
  isVerified: { type: Boolean, default: false }, // Email verification
  onboardingCompleted: { type: Boolean, default: false },
  
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" }
  },
  
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  }
}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);