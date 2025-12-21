import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    phone: String,
    password: String,

    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },

    /* ========= SELLER FIELDS ========= */
    storeName: {
      type: String,
    },

    businessCategory: {
      type: String,
    },

    isApproved: {
      type: Boolean,
      default: false, 
    },

    /* ========= EMAIL VERIFICATION ========= */
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailOTP: String,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
