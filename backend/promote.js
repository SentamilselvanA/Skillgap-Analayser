const { connectDB, connection } = require("./db");
const User = require("./models/User");

const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address. Example: node promote.js admin@example.com");
  process.exit(1);
}

async function promote() {
  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: "admin" },
      { returnDocument: "after" }
    );

    if (!user) {
      console.error("User not found.");
      process.exit(1);
    }

    console.log(`User ${user.name} (${user.email}) promoted to ${user.role}.`);
    process.exit(0);
  } catch (err) {
    console.error("Promotion failed:", err);
    process.exit(1);
  }
}

promote();
