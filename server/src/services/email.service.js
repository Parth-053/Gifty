import { transporter } from "../config/email.js";
import { envConfig } from "../config/env.config.js";
import { logger } from "../config/logger.js";

/**
 * Generic Send Email Function
 * @param {Object} options - { to, subject, html }
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Gifty Support" <${envConfig.email.smtpUser}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent: ${info.messageId} to ${to}`);
    return true;
  } catch (error) {
    logger.error(`❌ Email send failed to ${to}: ${error.message}`);
    return false;
  }
};

/**
 * Template: Welcome Email
 */
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <h1>Welcome to Gifty, ${name}!</h1>
    <p>We are excited to have you on board. Start exploring unique gifts now.</p>
  `;
  await sendEmail({ to: email, subject: "Welcome to Gifty! 🎁", html });
};