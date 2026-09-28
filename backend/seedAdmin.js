require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
    }

    const existingAdmin = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully.");
    console.log(`Admin email: ${admin.email}`);

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);

    process.exit(1);
  }
};

seedAdmin();