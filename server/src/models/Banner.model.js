import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    publicId: String
  },
  type: {
    type: String,
    enum: ['Main Slider', 'Small Banner', 'Footer Banner'],
    default: 'Main Slider'
  },
  link: String, // Where to redirect on click
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Banner = mongoose.model("Banner", bannerSchema);