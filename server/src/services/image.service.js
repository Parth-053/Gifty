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
    const uploadPromises = files.map((file) => {
      // Use file.path because we are now using Disk Storage
      if (!file.path) {
        throw new Error(`File path missing for ${file.originalname}`);
      }
      return uploadOnCloudinary(file.path, folder);
    });

    const results = await Promise.all(uploadPromises);
    
    // Filter out failed uploads
    const validResults = results.filter(res => res !== null);

    if (validResults.length === 0 && files.length > 0) {
       throw new Error("All image uploads failed");
    }

    return validResults.map((res) => ({
      url: res.url,
      publicId: res.publicId
    }));
  } catch (error) {
    throw new ApiError(500, "Image upload failed: " + error.message);
  }
};

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