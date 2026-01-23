import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true,
    // Indian GSTIN Regex
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format']
  },
  role: {
    type: String,
    default: 'seller',
    immutable: true 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
    index: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Business Address (Separate from personal address)
  businessAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  bankDetails: {
     accountNumber: { type: String, trim: true },
     ifscCode: { type: String, trim: true, uppercase: true },
     bankName: String,
     accountName: String,
     isVerified: { type: Boolean, default: false }
  }
}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);