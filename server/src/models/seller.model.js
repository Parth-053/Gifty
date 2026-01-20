import mongoose from "mongoose";
import slugify from "slugify";

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"],
      unique: true,
      trim: true,
      maxlength: 50
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },
    
    // Business Details
    gstin: { 
      type: String, 
      trim: true, 
      default: null 
    },
    panNumber: { 
      type: String, 
      trim: true, 
      default: null 
    },
    
    // Bank Details synced with BankDetails.jsx
    bankDetails: {
      accountNumber: { type: String, select: false },
      ifscCode: { type: String, select: false },
      bankName: { type: String, select: false },
      accountName: { type: String, select: false }  
    },

    // Admin Approval Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true
    },
    
    vacationMode: {
      type: Boolean,
      default: false
    },

    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

// Auto-generate slug
sellerSchema.pre("save", function (next) {
  if (this.isModified("storeName")) {
    this.slug = slugify(this.storeName, { lower: true, strict: true });
  }
  next();
});

export const Seller = mongoose.model("Seller", sellerSchema);