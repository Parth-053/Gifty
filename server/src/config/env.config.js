// server/src/config/env.config.js
import dotenv from "dotenv";
import Joi from "joi";

// Load .env file
dotenv.config();

// Define Schema for Environment Variables
const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  MONGODB_URI: Joi.string().required().description("Database URL"),
  CORS_ORIGIN: Joi.string().default("*").description("Allowed Origins"),
  
  // Firebase Config (NEW)
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
  
  // Admin Setup
  ADMIN_EMAIL: Joi.string().email().required(),
  
  // Cloudinary (Images)
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  // Payment (Razorpay) 
  RAZORPAY_KEY_ID: Joi.string().allow("").optional(),
  RAZORPAY_KEY_SECRET: Joi.string().allow("").optional(),

  // AI (Gemini)
  GEMINI_API_KEY: Joi.string().allow("").optional()
})
.unknown(); // Allow other unknown variables

// Validate
const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  console.error(`❌ Config validation error: ${error.message}`);
  process.exit(1);
}

export const envConfig = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  mongoose: {
    url: envVars.MONGODB_URI,
  },
  cors: {
    origin: envVars.CORS_ORIGIN.split(","), 
    credentials: true,
  },
  adminEmail: envVars.ADMIN_EMAIL,
  firebase: {
    projectId: envVars.FIREBASE_PROJECT_ID,
    privateKey: envVars.FIREBASE_PRIVATE_KEY,
    clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
  },
  cloudinary: {
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET,
  },
  razorpay: {
    keyId: envVars.RAZORPAY_KEY_ID,
    keySecret: envVars.RAZORPAY_KEY_SECRET,
  },
  ai: {
    geminiKey: envVars.GEMINI_API_KEY
  }
};