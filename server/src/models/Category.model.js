import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true
    },
    description: { type: String, maxlength: 500 },
    image: {
      url: String,
      publicId: String
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true
    },

    path: { type: String, default: null },
    
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    level: { type: Number, default: 0 } 
  },
  { timestamps: true }
);

// Auto-generate slug
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Category = mongoose.model("Category", categorySchema);