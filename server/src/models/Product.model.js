import mongoose from "mongoose";
import slugify from "slugify";

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
      maxlength: 200,
      index: "text" // Full-text search
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },
    
    price: { type: Number, required: true, min: 0, index: true },
    discountPrice: { 
      type: Number, 
      min: 0,
      validate: {
        validator: function(val) { return !val || val < this.price; },
        message: "Discount price must be less than regular price"
      }
    },
    
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },
    
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ],
    
    stock: { type: Number, required: true, min: 0 },
    
    // Customization (For Gifting)
    isCustomizable: { type: Boolean, default: false },
    customizationOptions: [{ type: String }], // e.g. ["text", "image", "color"]
    
    tags: [String],
    
    rating: {
      average: { type: Number, default: 0, index: true },
      count: { type: Number, default: 0 }
    },

    // Admin & Control
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    isActive: { type: Boolean, default: true, index: true }, // Seller toggle
    isDeleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Indexes for Filtering
productSchema.index({ categoryId: 1, isActive: 1, price: 1 });

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Date.now();
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
export default Product; // Default export for compatibility