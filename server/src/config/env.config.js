import dotenv from "dotenv";

// Load .env file
dotenv.config();

// Validation: Check ALL critical variables
const requiredEnvs = [
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET"
];

// Loop through required keys and validate
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ FATAL ERROR: Missing ${key} in .env file`);
    process.exit(1); // Kill server immediately if config is missing
  }
});

export const envConfig = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  adminEmail: process.env.ADMIN_EMAIL,
  
  // Optional: Centralized access to other keys (good for autocomplete)
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
  }
};