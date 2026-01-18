import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    type: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;