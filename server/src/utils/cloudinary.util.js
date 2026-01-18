import { v2 as cloudinary } from "cloudinary";
import { logger } from "../config/logger.js"; 

/**
 * Upload Image to Cloudinary (from Buffer)
 * @param {Buffer} buffer - File buffer from Multer
 * @param {String} folder - Folder name in Cloudinary (e.g. "products", "avatars")
 */
export const uploadOnCloudinary = async (buffer, folder = "general") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `gifty/${folder}`, // Organized folder structure
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    // Write buffer to stream
    uploadStream.end(buffer);
  });
};

/**
 * Delete Image from Cloudinary
 * @param {String} publicId - Cloudinary Public ID
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error("Cloudinary Delete Error:", error);
    return null;
  }
};