import axios from "axios";
import { envConfig } from "../config/env.config.js";
import { logger } from "../config/logger.js";

/**
 * Send Email using Brevo API (HTTP)
 * Uses the xkeysib- key from SMTP_PASSWORD as the api-key header.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = {
      sender: { 
        email: envConfig.email.senderEmail, 
        name: "Gifty Support" 
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": envConfig.email.apiKey, // Uses your SMTP_PASSWORD
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }
    );

    logger.info(`📧 Email sent to ${to} (MessageId: ${response.data.messageId})`);
    return true;
  } catch (error) {
    // Detailed error logging for debugging
    const errorMsg = error.response?.data?.message || error.message;
    logger.error(`❌ Email API failed to ${to}: ${errorMsg}`);
    
    if (error.response?.status === 401) {
        logger.error("⚠️ Check your SMTP_PASSWORD in .env - it must be a valid Brevo API Key");
    }
    
    return false;
  }
};

/**
 * Send OTP Email for Seller Verification
 */
export const sendOtpEmail = async (email, otp) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333;">Verify Your Account</h2>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="font-size: 16px; color: #555;">Your verification code for Gifty Seller registration is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px; font-size: 32px; margin: 20px 0;">${otp}</h1>
        <p style="font-size: 14px; color: #888;">This code expires in 5 minutes.</p>
      </div>
      <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
        <p>If you didn't request this code, please ignore this email.</p>
        <p>&copy; ${new Date().getFullYear()} Gifty. All rights reserved.</p>
      </div>
    </div>
  `;
  return await sendEmail({ to: email, subject: "Your Gifty Verification Code", html });
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>Welcome to Gifty, ${name}!</h1>
      <p>Your seller application is currently <strong>Pending Approval</strong>.</p>
      <p>Our team will review your details and notify you once your store is live.</p>
    </div>
  `;
  await sendEmail({ to: email, subject: "Welcome to Gifty! 🎁", html });
};