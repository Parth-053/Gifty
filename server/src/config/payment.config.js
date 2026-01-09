import dotenv from "dotenv";
dotenv.config();

export const paymentConfig = {
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  currency: "INR", // Default currency
};