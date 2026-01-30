import dotenv from "dotenv";
import Joi from "joi";

// Load .env file
dotenv.config();

// Define Schema to match your .env content
const envSchema = Joi.object({
  PORT: Joi.number().default(8000),
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  MONGODB_URI: Joi.string().required(),
  CORS_ORIGIN: Joi.string().default("*"),
  
  // Firebase
  FIREBASE_PROJECT_ID: Joi.string().required(),
  FIREBASE_PRIVATE_KEY: Joi.string().required(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().required(),
  
  // Admin
  ADMIN_EMAIL: Joi.string().email().required(),
  
  // Email Service (Your .env names)
  // We validate them here to ensure the app doesn't crash later
  SMTP_HOST: Joi.string().default("smtp-relay.brevo.com"),
  SMTP_PORT: Joi.number().default(587),
  SMTP_EMAIL: Joi.string().email().required(),
  SMTP_PASSWORD: Joi.string().required(), // This holds your 'xkeysib-' key

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
  
  adminEmail: envVars.ADMIN_EMAIL,
  
  firebase: {
    projectId: envVars.FIREBASE_PROJECT_ID,
    privateKey: envVars.FIREBASE_PRIVATE_KEY,
    clientEmail: envVars.FIREBASE_CLIENT_EMAIL,
  },
  
  // Email Config: Mapping your .env variables to usable keys
  email: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    senderEmail: envVars.SMTP_EMAIL,   // gifty.app07@gmail.com
    apiKey: envVars.SMTP_PASSWORD,     // xkeysib-... (Used as API Key)
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