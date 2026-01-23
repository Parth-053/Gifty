import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  image: {
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  },
  type: {
    type: String,
    enum: ['Main Slider', 'Small Banner', 'Footer Banner', 'Deal of Day'],
    default: 'Main Slider',
    index: true
  },
  link: { type: String },
  isActive: { type: Boolean, default: true, index: true },
  
  // To control the order of slides
  position: { type: Number, default: 0 },
  
  // Optional: Schedule banners
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
}, { timestamps: true });

export const Banner = mongoose.model("Banner", bannerSchema);