import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["product", "seller"],
      required: true
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    // Track data per day
    date: {
      type: Date,
      required: true,
      index: true
      // Store as midnight UTC (e.g., 2024-01-01T00:00:00.000Z)
    },

    views: {
      type: Number,
      default: 0,
      min: 0
    },

    clicks: {
      type: Number,
      default: 0,
      min: 0
    },

    purchases: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Optional: Revenue attribution for that day
    revenueGenerated: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

// Compound Index: Ensure only one document per Entity + Date
// This allows you to do: await Analytics.findOneAndUpdate({ entityId, date }, { $inc: { views: 1 } }, { upsert: true })
analyticsSchema.index(
  { entityType: 1, entityId: 1, date: 1 },
  { unique: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;