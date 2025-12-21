import mongoose from "mongoose";

/**
 * Customization sub-schema
 */
const customizationSchema = new mongoose.Schema(
  {
    isCustomizable: {
      type: Boolean,
      default: false,
    },

    mandatoryUploads: {
      images: {
        type: Boolean,
        default: false,
      },
      text: {
        type: Boolean,
        default: false,
      },
    },

    uploadLimits: {
      minImages: {
        type: Number,
        default: 0,
      },
      maxImages: {
        type: Number,
        default: 0,
      },
    },

    allowRandomize: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/**
 * Product schema
 */
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one product image is required",
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customization: customizationSchema,

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Product", productSchema);
