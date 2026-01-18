import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env.config.js";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: envConfig.cloudinary.name,
  api_key: envConfig.cloudinary.key,
  api_secret: envConfig.cloudinary.secret,
});

export { cloudinary };