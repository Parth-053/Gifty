import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import * as imageService from "./image.service.js";

/**
 * Update User Profile
 */
export const updateProfile = async (userId, data, file) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // 1. Handle Avatar
  if (file) {
    // Delete old avatar
    if (user.avatar?.publicId) {
      await imageService.deleteImages([{ publicId: user.avatar.publicId }]);
    }
    
    // Upload new
    const uploaded = await imageService.uploadImages([file], "avatars");
    user.avatar = uploaded[0]; 
  }

  // 2. Update Info
  if (data.fullName) user.fullName = data.fullName;
  if (data.phone) user.phone = data.phone;

  await user.save();
  return user;
};

/**
 * Get User by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};