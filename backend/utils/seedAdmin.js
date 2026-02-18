import Admin from "../models/Admin.js";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.warn("⚠️ Admin credentials not found in .env. Skipping admin seeding.");
      return;
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", adminEmail);
      return;
    }

    // Create new admin (password auto-hashed in pre-save hook in Admin model)
    await Admin.create({
      fullName: "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "super-admin",
    });

    console.log("✅ Admin created successfully!");
    console.log(`🔑 Email: ${adminEmail}`);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  }
};

export default seedAdmin;
