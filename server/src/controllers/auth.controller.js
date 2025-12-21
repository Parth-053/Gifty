import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";

/* =========================
   REGISTER (USER)
   ========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      emailOTP: otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      isEmailVerified: false,
    });

    await sendEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent to email. Please verify to continue.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   REGISTER (SELLER)
   ========================= */
export const sellerRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      storeName,
      businessCategory,
    } = req.body;

    if (!email || !password || !storeName) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "seller",
      storeName,
      businessCategory,
      isApproved: false,
      emailOTP: otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      isEmailVerified: false,
    });

    await sendEmail(email, otp);

    return res.status(200).json({
      message:
        "OTP sent. After verification, seller account will be reviewed by admin.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   VERIFY EMAIL OTP
   ========================= */
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (
      user.emailOTP !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailOTP = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   RESEND OTP
   ========================= */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    user.emailOTP = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendEmail(email, otp);

    return res.json({ message: "OTP resent to email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGIN (USER / SELLER / ADMIN)
   ========================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // role must be: "user" | "seller" | "admin"

    if (!email || !password ) {
      return res
        .status(400)
        .json({ message: "Email, password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    // 🔒 SELLER APPROVAL CHECK
    if (user.role === "seller" && !user.isApproved) {
      return res.status(403).json({
        message: "Seller account is under review",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeName: user.storeName || null,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET LOGGED-IN USER
   ========================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -emailOTP -otpExpiresAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
