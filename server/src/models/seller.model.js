import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    // 🔥 FIXED: Link Seller Profile to the User Account
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // One user can have only one seller profile
        index: true
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    // This is purely for public display (Contact Email), NOT for login
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
      // Removed 'unique: true' to avoid conflict with User table
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    logo: {
      url: { type: String },
      publicId: { type: String }
    },

    bannerImage: {
      url: { type: String },
      publicId: { type: String }
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"], // Added 'rejected'
      default: "pending",
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;