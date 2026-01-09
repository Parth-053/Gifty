import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
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
      sparse: true
    },

    passwordHash: {
      type: String,
      required: true,
      select: false  
    },

    role: {
      type: String,
      enum: ["user", "seller", "admin"], 
      default: "user"
    },

    isVerified: {
      type: Boolean,
      default: false
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true  
  }
);

const User = mongoose.model("User", userSchema);

export default User;