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
      index: "text"  
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
        validator: function(val) {
           return !val || val < this.price; 
        },
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
    
    stock: { type: Number, required: true, min: 0, default: 0 },
    
    // Customization (For Gifting Platform)
    isCustomizable: { type: Boolean, default: false },
    customizationOptions: [{ type: String }], 
    
    tags: [String],
    
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 }
    },

    // Admin & Control
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },
    isActive: { type: Boolean, default: true, index: true },  
    isDeleted: { type: Boolean, default: false },  
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// 1. Indexes for High Performance Filtering
productSchema.index({ categoryId: 1, isActive: 1, price: 1 });
productSchema.index({ slug: 1 });

// 2. Auto-generate Slug before saving
productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  
  this.slug = slugify(this.name, { lower: true, strict: true }) + 
              "-" + 
              Math.floor(Math.random() * 1000);  
  next();
});

// 3. Virtual for Calculating Percentage Off
productSchema.virtual("percentageOff").get(function () {
  if (!this.discountPrice || this.discountPrice >= this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

export const Product = mongoose.model("Product", productSchema);