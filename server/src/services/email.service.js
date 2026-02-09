import axios from "axios";
import { envConfig } from "../config/env.config.js";
import { logger } from "../config/logger.js";

/**
 * Send Email using Brevo API (HTTP)
 * Supports single email string or array of email strings.
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    // FIX: Handle both single string and array of emails
    const recipients = Array.isArray(to) 
      ? to.map(email => ({ email })) 
      : [{ email: to }];

    const data = {
      sender: { 
        email: envConfig.email.senderEmail, 
        name: "Gifty Support" 
      },
      to: recipients, // Updated to use the processed list
      subject: subject,
      htmlContent: html,
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      {
        headers: {
          "api-key": envConfig.email.apiKey, 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      }
    );

    logger.info(`📧 Email sent to ${JSON.stringify(to)} (MessageId: ${response.data.messageId})`);
    return true;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    logger.error(`❌ Email API failed: ${errorMsg}`);
    
    if (error.response?.status === 401) {
        logger.error("⚠️ Check your SMTP_PASSWORD in .env - it must be a valid Brevo API Key");
    }
    
    return false;
  }
};

/**
 * Send OTP Email
 */
export const sendOtpEmail = async (email, otp) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333;">Verify Your Account</h2>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
        <p style="font-size: 16px; color: #555;">Your verification code is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px; font-size: 32px; margin: 20px 0;">${otp}</h1>
        <p style="font-size: 14px; color: #888;">Expires in 5 minutes.</p>
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