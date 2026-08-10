const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@makeupcity.com";
    const adminPassword = "Admin@12345";

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      adminPassword,
      salt
    );

    // Create admin
    const admin = await User.create({
      name: "Makeup City Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("================================");
    console.log("Admin created successfully!");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();