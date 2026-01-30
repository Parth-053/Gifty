import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  storeName: { type: String, required: true },
  phone: { type: String, required: true },
  gstin: { type: String, default: "" },
  
  // --- STATUS FLAGS ---
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "suspended"], 
    default: "pending", 
    index: true 
  },
  
  // FIX: Default must be FALSE. Only Admin approval sets this to true.
  isActive: { type: Boolean, default: false }, 
  
  isVerified: { type: Boolean, default: false }, // Email verification
  onboardingCompleted: { type: Boolean, default: false },
  rejectionReason: { type: String, default: "" },

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