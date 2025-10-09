import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import bcrypt from "bcryptjs"; // use bcryptjs for compatibility

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    const adminEmail = "bluenile66@gmail.com";
    const adminPassword = "admin123";

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", adminEmail);
      process.exit();
    }

    // Create new admin (password auto-hashed in pre-save hook)
    const newAdmin = await Admin.create({
      fullName: "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "super-admin",
    });

    console.log("✅ Admin created successfully!");
    console.log(`🔑 Email: ${adminEmail}`);
    console.log(`🔐 Password: ${adminPassword}`);

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
