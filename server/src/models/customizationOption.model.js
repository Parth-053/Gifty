import mongoose from "mongoose";

const customizationOptionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    // 🔥 NOT ENUM — fully flexible
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
      // examples: text, image, date, color, audio, emoji, font, engraving
    },

    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    required: {
      type: Boolean,
      default: false
    },

    maxLength: {
      type: Number,
      min: 1
    },

    priceExtra: {
      type: Number,
      min: 0,
      default: 0
    },

    // 🔐 Type-specific config (optional)
    meta: {
      type: Object,
      default: {}
      /*
        examples:
        text  → { maxLength: 20 }
        image → { maxSizeMB: 5, formats: ["jpg","png"] }
        color → { allowed: ["red","blue"] }
        audio → { maxDurationSec: 30 }
      */
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

customizationOptionSchema.index(
  { productId: 1, label: 1 },
  { unique: true }
);

const CustomizationOption = mongoose.model(
  "CustomizationOption",
  customizationOptionSchema
);

export default CustomizationOption;
