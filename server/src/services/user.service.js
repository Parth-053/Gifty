import { User } from "../models/User.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";
import {ApiError }from "../utils/ApiError.js";

/**
 * Update User Profile
 * Handles text updates (fullName, phone) and avatar image upload
 */
export const updateProfile = async (userId, data, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 1. Handle Avatar Upload (if a file is provided)
  if (file) {
    // Delete old avatar from Cloudinary if it exists and has a publicId
    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }
    
    // Upload new image to "avatars" folder
    // Note: Ensure your multer middleware passes 'path' or 'buffer'
    const imageBuffer = file.buffer || file.path; 
    const uploaded = await uploadOnCloudinary(imageBuffer, "avatars");
    
    user.avatar = {
      url: uploaded.url,
      publicId: uploaded.public_id // Cloudinary response key is usually 'public_id'
    };
  }

  // 2. Update Text Fields
  if (data.fullName) user.fullName = data.fullName;
  if (data.phone) user.phone = data.phone;
  
  // Save changes
  await user.save();
  
  // Return updated user
  return user;
};

/**
 * Get User Profile by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId).populate("addresses");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

/**
 * Deactivate User (Optional - Soft Delete)
 * Note: Add 'isActive' field in User Model if you want to use this
 */
/*
export const deactivateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.isActive = false; // Ensure schema has this field
  await user.save();
  return { message: "User deactivated successfully" };
};
*/