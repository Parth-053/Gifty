import Razorpay from "razorpay";
import { envConfig } from "./env.config.js";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, 
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});