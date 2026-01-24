import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    key: { 
      type: String, 
      default: "GLOBAL_SETTINGS", 
      unique: true 
    },
    
    // 1. Seller Charge (Percentage) 
    sellerCommission: {
      type: Number,
      default: 5, 
      min: 0,
      max: 100
    },

    // 2. Buyer Charge (Fixed Amount) 
    buyerPlatformFee: {
      type: Number,
      default: 0,
      min: 0
    },
    
    taxRate: {
      type: Number,
      default: 18 // Global Tax Rate  
    },
    
    minPayoutAmount: {
      type: Number,
      default: 500
    },
    
    isMaintenanceMode: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);