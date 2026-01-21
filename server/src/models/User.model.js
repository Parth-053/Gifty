import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import { envConfig } from "../config/env.config.js";

const userSchema = new mongoose.Schema(
  {
    // ... (baki fields same rahenge: name, email, phone, etc.)
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      index: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    phone: {
      type: String,
      trim: true,
      sparse: true 
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false 
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
      immutable: true 
    },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    
    // ADDED: Fields for storing verification code
    verificationCode: {
      type: String,
      select: false
    },
    verificationCodeExpire: Date,

    loginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

// Password Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ... (Token methods same rahenge)

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// ADDED: Method to generate 6-digit OTP
userSchema.methods.generateVerificationCode = function () {
  // Generate a random 6-digit number
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash it before saving to DB (Security Best Practice)
  this.verificationCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  // Code expires in 15 minutes
  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;

  return code; // Return the plain code to send in email
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    envConfig.jwt.accessSecret,
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    envConfig.jwt.refreshSecret,
    { expiresIn: "7d" }
  );
};

export const User = mongoose.model("User", userSchema);