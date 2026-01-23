import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    key: { 
      type: String, 
      default: "GLOBAL_SETTINGS", 
      unique: true 
    },
    
    platformCommission: {
      type: Number,
      default: 10, // Admin takes 10% from every sale
      min: 0,
      max: 100
    },
    
    taxRate: {
      type: Number,
      default: 18 // 18% GST default
    },
    
    minPayoutAmount: {
      type: Number,
      default: 500 // Sellers must have ₹500 to withdraw
    },
    
    supportEmail: { type: String, default: "support@gifty.com" },
    supportPhone: { type: String },
    
    isMaintenanceMode: { type: Boolean, default: false },
    
    featuredCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
  },
  { timestamps: true }
);

export const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);