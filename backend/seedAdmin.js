import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js"; // Make sure this path is correct

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: "hailegebrelyalember@gmail.com",
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    // Create new admin
    const newAdmin = await Admin.create({
      fullName: "Super Admin",
      email: "hailegebrelyalember@gmail.com",
      password: "admin123", // will be hashed automatically
      role: "super-admin",
    });

    console.log("Admin created successfully!");
    console.log("Email: hailegebrelyalember@gmail.com");
    console.log("Password: admin123");

    process.exit();
  } catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
