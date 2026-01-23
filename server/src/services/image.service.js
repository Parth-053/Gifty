import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.util.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Upload Multiple Images
 * @param {Array} files - Array of Multer file objects
 * @param {String} folder - Cloudinary folder name
 */
export const uploadImages = async (files, folder = "products") => {
  if (!files || files.length === 0) return [];

  try {
    const uploadPromises = files.map((file) => 
      uploadOnCloudinary(file.buffer, folder)
    );

    const results = await Promise.all(uploadPromises);
    
    return results.map((res) => ({
      url: res.url,
      publicId: res.publicId
    }));
  } catch (error) {
    throw new ApiError(500, "Image upload failed", [], error.message);
  }
};

/**
 * Delete Multiple Images
 * @param {Array} images - Array of objects { publicId: "..." }
 */
export const deleteImages = async (images) => {
  if (!images || images.length === 0) return;

  try {
    const deletePromises = images.map((img) => 
      img.publicId ? deleteFromCloudinary(img.publicId) : Promise.resolve()
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Image deletion error:", error);
  }
};