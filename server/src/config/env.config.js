import dotenv from "dotenv";
import Joi from "joi";

// Load .env file
dotenv.config();

// Define Schema for Environment Variables
const envSchema = Joi.object({
  PORT: Joi.number().default(8000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  MONGODB_URI: Joi.string().required().description("Database URL"),
  CORS_ORIGIN: Joi.string().default("*").description("Allowed Origins"),
  
  // Security Secrets
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  
  // Admin Setup
  ADMIN_EMAIL: Joi.string().email().required(),
  
  // Cloudinary (Images)
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  // Payment
  RAZORPAY_KEY_ID: Joi.string().optional(),
  RAZORPAY_KEY_SECRET: Joi.string().optional()
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
    options: {
      // Modern Mongoose options are default in v7+, keeping empty for now
    },
  },
  cors: {
    origin: envVars.CORS_ORIGIN.split(","), // Supports multiple origins via comma
    credentials: true,
  },
  jwt: {
    accessSecret: envVars.ACCESS_TOKEN_SECRET,
    refreshSecret: envVars.REFRESH_TOKEN_SECRET,
    accessExpiration: "15m",
    refreshExpiration: "7d",
  },
  adminEmail: envVars.ADMIN_EMAIL,
  cloudinary: {
    name: envVars.CLOUDINARY_CLOUD_NAME,
    key: envVars.CLOUDINARY_API_KEY,
    secret: envVars.CLOUDINARY_API_SECRET
  }
};