import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    selectedCustomizations: {
      type: Object,
      default: {}
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true // ✅ यह काफी है, नीचे अलग से लिखने की ज़रूरत नहीं
    },

    items: [cartItemSchema]
  },
  {
    timestamps: { createdAt: false, updatedAt: true }
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;