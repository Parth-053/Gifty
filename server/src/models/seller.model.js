import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  bankName: { type: String },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  country: { type: String, default: "India" }
}, { _id: false });

const sellerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "seller",
    },
    storeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    storeDescription: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      trim: true,
      default: null
    },
    logo: {
      publicId: String,
      url: String
    },
    banner: {
      publicId: String,
      url: String
    },
    
    // Onboarding Fields
    address: { type: addressSchema, default: {} },
    bankDetails: { type: bankDetailsSchema, default: {} },
    
    // Status Flags
    isVerified: {
      type: Boolean,
      default: false, // Admin approval
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // CRITICAL: Flag to track if onboarding is done
    onboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);