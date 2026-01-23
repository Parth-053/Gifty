import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phone: {
    type: String,
    trim: true,
    // Basic regex for international numbers or 10-digit
    match: [/^\+?[1-9]\d{1,14}$|^[0-9]{10}$/, 'Please fill a valid phone number']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    url: { type: String, default: "https://via.placeholder.com/150" },
    publicId: { type: String, default: null } 
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // We keep addresses embedded as they are usually few per user
  addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);