import nodemailer from "nodemailer";
import { envConfig } from "../config/env.config.js";
import { logger } from "../config/logger.js";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use SMTP host/port from env
  auth: {
    user: process.env.SMTP_EMAIL, // Add to .env
    pass: process.env.SMTP_PASSWORD // Add to .env (App Password)
  }
});

/**
 *  Send Email Utility
 * @param {Object} options - { email, subject, message, html }
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html 
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error("Email send failed:", error);
    // Don't throw error to prevent crashing main flow, just return false
    return false;
  }
};