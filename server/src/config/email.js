import nodemailer from "nodemailer";
import { envConfig } from "./env.config.js";
import { logger } from "./logger.js";

 
const emailConfig = {
  host: envConfig.email.host || "smtp-relay.brevo.com", 
  port: parseInt(envConfig.email.port) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: envConfig.email.smtpUser,  
    pass: envConfig.email.smtpPass,  
  }, 
  pool: true, 
  maxConnections: 5,
  maxMessages: 100
};

export const transporter = nodemailer.createTransport(emailConfig);

// Verify connection on startup
if (envConfig.email.smtpUser && envConfig.email.smtpPass) {
  transporter.verify((error) => {
    if (error) {
      logger.error(`❌ Email Service Error: ${error.message}`);
    } else {
      logger.info(`✅ Email Service Ready (Host: ${emailConfig.host})`);
    }
  });
}