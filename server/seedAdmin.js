import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./src/models/User.model.js"; 

// Load .env file
dotenv.config();

const seedAdmin = async () => {
  try {
    const dbUri = process.env.MONGODB_URI; 
    
    console.log("🔹 Attempting to connect to DB...");

    if (!dbUri) {
      throw new Error("❌ MONGODB_URI is undefined. Check your .env file!");
    }

    // 1. Connect to MongoDB
    await mongoose.connect(dbUri);
    console.log("✅ Connected to MongoDB");

    // 2. Admin Details
    const adminData = {
      fullName: "Parth",
      email: "sosaparth007@gmail.com",
      password: "Sosa@123",
      role: "admin",
      isActive: true,
      isEmailVerified: true,
      // 👇 FIXED: Added a dummy Firebase UID to satisfy the model requirement
      firebaseUid: `admin_seed_${Date.now()}`, 
    };

    // 3. Check if Admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      process.exit();
    }

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // 5. Create Admin
    const newAdmin = new User({
      ...adminData,
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("🎉 Admin created successfully!");
    console.log(`👉 Email: ${adminData.email}`);
    console.log(`👉 Role: ${newAdmin.role}`);
    console.log(`👉 Firebase UID: ${adminData.firebaseUid}`);

  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
  } finally {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    process.exit();
  }
};

seedAdmin();