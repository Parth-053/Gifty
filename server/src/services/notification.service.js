import { Notification } from "../models/Notification.model.js";
import { User } from "../models/User.model.js";
import { sendEmail } from "./email.service.js";
import { logger } from "../config/logger.js";

/**
 * @desc    Centralized system to Notify Admins (DB + Email)
 * @param   {Object} params
 * @param   {String} params.type - Enum: "NEW_USER", "NEW_SELLER", "ORDER", "INVENTORY"
 * @param   {String} params.title - Title for UI and Email Subject
 * @param   {String} params.message - Body text
 * @param   {Object} params.data - Metadata (userId, orderId, etc.)
 */
export const notifyAdmin = async ({ type, title, message, data = {} }) => {
  try {
    // 1. Create DB Notification (For Admin Dashboard)
    // We set role: "admin" so all admins can see it in their dashboard
    await Notification.create({
      recipient: null, // null implies system-wide for the specific role
      role: "admin",
      type,
      title,
      message,
      data,
      isRead: false
    });

    // 2. Fetch All Admin Emails
    const admins = await User.find({ role: "admin" }).select("email");
    const adminEmails = admins.map(admin => admin.email);

    // 3. Send Email Alert (If admins exist)
    if (adminEmails.length > 0) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4F46E5;">${title}</h2>
          <p style="font-size: 16px; color: #333;">${message}</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Details:</strong>
            <pre style="margin-top: 10px; color: #555;">${JSON.stringify(data, null, 2)}</pre>
          </div>

          <a href="${process.env.ADMIN_URL || 'http://localhost:5173'}/notifications" 
             style="background: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
             View in Admin Panel
          </a>
        </div>
      `;

      // Use the updated sendEmail that accepts an array
      await sendEmail({
        to: adminEmails,
        subject: `[Admin Alert] ${title}`,
        html: emailHtml
      });
    }

  } catch (error) {
    // Log error but don't crash the app (Notification failure shouldn't stop the main flow)
    logger.error(`⚠️ Notification Service Failed: ${error.message}`);
  }
};