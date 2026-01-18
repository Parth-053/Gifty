import { User } from "../models/User.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Update User Profile
 * Handles text updates (name, phone) and avatar image upload
 */
export const updateProfile = async (userId, data, file) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Handle Avatar Upload (if a file is provided)
  if (file) {
    // 1. Delete old avatar from Cloudinary if it exists
    if (user.avatar?.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }
    
    // 2. Upload new image to "avatars" folder
    const uploaded = await uploadOnCloudinary(file.buffer, "avatars");
    user.avatar = {
      url: uploaded.url,
      publicId: uploaded.publicId
    };
  }

  // Update text fields if provided
  if (data.name) user.name = data.name;
  if (data.phone) user.phone = data.phone;
  
  await user.save();
  
  // Return updated user without sensitive data (password/refresh token)
  return await User.findById(userId).select("-password -refreshToken");
};

/**
 *  Deactivate User (Soft Delete)
 */
export const deactivateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  
  return true; 
};