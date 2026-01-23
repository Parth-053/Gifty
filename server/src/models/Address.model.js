import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'ownerModel',
      index: true
    },
    ownerModel: {
      type: String,
      required: true,
      enum: ['User', 'Seller'],
      default: 'User'
    },
    
    fullName: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    phone: { 
      type: String, 
      required: true, 
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$|^[0-9]{10}$/, 'Please fill a valid phone number']
    },
    
    addressLine1: { 
      type: String, 
      required: true,
      maxlength: 255 
    },
    addressLine2: { 
      type: String,
      maxlength: 255
    },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    pincode: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 10 
    },
    
    // Expanded types to include Seller specific locations
    type: { 
      type: String, 
      enum: ["Home", "Work", "Warehouse", "Pickup", "Return", "Other"], 
      default: "Home" 
    },
    
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Address = mongoose.model("Address", addressSchema);