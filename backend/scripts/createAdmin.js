require("dotenv").config();

const sequelize = require("../config/db");
const User = require("../models/User");

const args = process.argv.slice(2);

const getArgValue = (key) => {
  const keyIndex = args.indexOf(`--${key}`);
  if (keyIndex === -1) return undefined;
  return args[keyIndex + 1];
};

const adminName = getArgValue("name") || process.env.ADMIN_NAME || "Administrator";
const adminEmail = getArgValue("email") || process.env.ADMIN_EMAIL;
const adminPassword = getArgValue("password") || process.env.ADMIN_PASSWORD;

const usage = `
Usage:
  npm run create-admin -- --email admin@example.com --password "StrongPass123!" [--name "Store Admin"]

Environment fallback:
  ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
`;

const validateInput = () => {
  if (!adminEmail || !adminPassword) {
    console.error("Missing required admin credentials.");
    console.error(usage);
    process.exit(1);
  }

  if (adminPassword.length < 8) {
    console.error("Admin password must be at least 8 characters.");
    process.exit(1);
  }
};

const createAdmin = async () => {
  validateInput();

  try {
    await sequelize.authenticate();

    const existingUser = await User.findOne({ where: { email: adminEmail } });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log(`Admin user already exists: ${adminEmail}`);
      } else {
        console.log(
          `User already exists with role "${existingUser.role}". Choose a new email to create a dedicated admin user.`
        );
      }
      return;
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      emailVerified: true,
    });

    console.log(`Admin user created: ${adminEmail}`);
  } catch (error) {
    console.error("Failed to create admin user:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

createAdmin();
