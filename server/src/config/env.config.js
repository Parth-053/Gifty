import dotenv from "dotenv";
import Joi from "joi";

// Load .env file
dotenv.config();

// Define Schema
const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  MONGODB_URI: Joi.string().required(),
  CORS_ORIGIN: Joi.string().default("*"),
  
  // Firebase
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
  
  // Admin
  ADMIN_EMAIL: Joi.string().email().required(),
  
  // Email Service (SMTP) - [ADDED THIS SECTION]
  SMTP_EMAIL: Joi.string().email().required().description("Email used to send notifications"),
  SMTP_PASSWORD: Joi.string().required().description("App Password for Gmail"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  // Payment & AI
  RAZORPAY_KEY_ID: Joi.string().allow("").optional(),
  RAZORPAY_KEY_SECRET: Joi.string().allow("").optional(),
  GEMINI_API_KEY: Joi.string().allow("").optional()
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env);

if (error) {
  console.error(`❌ Config validation error: ${error.message}`);
  process.exit(1);
}

export const envConfig = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  mongoose: { url: envVars.MONGODB_URI },
  cors: { origin: envVars.CORS_ORIGIN.split(","), credentials: true },
  
  // Auth & Admin
  adminEmail: envVars.ADMIN_EMAIL,
  firebase: {
    projectId: envVars.FIREBASE_PROJECT_ID,
    privateKey: envVars.FIREBASE_PRIVATE_KEY,
    clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
  },
  
  // Email Config [NEW]
  email: {
    smtpUser: envVars.SMTP_EMAIL,
    smtpPass: envVars.SMTP_PASSWORD,
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