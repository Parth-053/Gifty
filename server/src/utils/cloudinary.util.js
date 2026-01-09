import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary (Keys from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {String} localFilePath - Path to file in ./public/temp
 * @returns {Promise<Object>} - Cloudinary Response (url, public_id)
 */
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "gifty_products" // Organized folder in Cloud Cloudinary
    });

    // File uploaded successfully, remove local file
    fs.unlinkSync(localFilePath);
    
    return {
      url: response.secure_url,
      publicId: response.public_id
    };

  } catch (error) {
    // Upload failed, remove local file to prevent junk accumulation
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

/**
 * Delete file from Cloudinary (Used when updating/deleting product)
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return null;
  }
};