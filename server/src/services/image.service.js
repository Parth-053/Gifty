import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Handle Image Uploads
 * Supports single or multiple files
 */
export const uploadImages = async (files, folder = "products") => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map((file) => 
    uploadOnCloudinary(file.buffer, folder)
  );

  try {
    const results = await Promise.all(uploadPromises);
    return results.map((res) => ({
      url: res.url,
      publicId: res.publicId
    }));
  } catch (error) {
    throw new ApiError(500, "Image upload failed: " + error.message);
  }
};

/**
 * Handle Image Deletion
 */
export const deleteImages = async (images) => {
  if (!images || images.length === 0) return;

  const deletePromises = images.map((img) => 
    deleteFromCloudinary(img.publicId)
  );

  await Promise.all(deletePromises);
};