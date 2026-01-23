import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 50, // Safety limit
    default: 1 
  },
  
  // Updated to match Order Model's Dynamic Structure
  customizationDetails: [
    {
      optionName: { type: String, required: true },  
      type: { type: String, default: "text" },    
      value: { type: String, required: true },   
      additionalPrice: { type: Number, default: 0 }
    }
  ]
}, { _id: false });

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    items: [cartItemSchema],
    
    // Optional: Cache total to avoid recalculation on every read
    cartTotal: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);