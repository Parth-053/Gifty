import { Notification } from "../models/Notification.model.js";
import { User } from "../models/User.model.js";
import { sendEmail } from "./email.service.js";
import { logger } from "../config/logger.js";

/**
 * @desc    Notify Seller (Saved to DB for Seller Dashboard)
 */
export const notifySeller = async (sellerId, { type, title, message, data }) => {
  try {
    await Notification.create({
      recipient: sellerId,
      role: 'seller',  
      type,
      title,
      message,
      data,
      isRead: false
    }); 
  } catch (error) {
    console.error("Notification Service Error:", error);
  }
};

/**
 * @desc    Notify Admin (DB + Email)
 */
export const notifyAdmin = async ({ type, title, message, data = {} }) => {
  try {
    // 1. Create DB Notification
    await Notification.create({
      recipient: null,
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

    // 3. Send Email Alert
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

      await sendEmail({
        to: adminEmails,
        subject: `[Admin Alert] ${title}`,
        html: emailHtml
      });
    }

  } catch (error) {
    logger.error(`⚠️ Notification Service Failed: ${error.message}`);
  }
};