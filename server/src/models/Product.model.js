import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          // Only validate if discountPrice is set
          if (value === undefined || value === null) return true;
          return value < this.price;
        },
        message: "Discount price ({VALUE}) must be strictly less than the original price."
      }
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ],

    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true
      }
    ],

    tags: [{ type: String, trim: true, lowercase: true }],

    // 📦 Inventory Management
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    // Stock currently held in active checkouts but not yet paid
    reservedStock: {
      type: Number,
      min: 0,
      default: 0
    },

    isCustomizable: {
      type: Boolean,
      default: false
    },

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0
    },

    visibility: {
      type: String,
      enum: ["public", "hidden"],
      default: "public",
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Ensure virtuals are included in JSON response
    toObject: { virtuals: true }
  }
);

// 🔥 Virtual: Calculate actually sellable stock
productSchema.virtual("availableStock").get(function () {
  return Math.max(0, this.stock - this.reservedStock);
});

// Indexes
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ sellerId: 1, visibility: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;