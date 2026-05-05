const pool = require("./db");

const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address.");
  process.exit(1);
}

async function promote() {
  try {
    const result = await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, name, role",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      console.error("User not found.");
      process.exit(1);
    }

    console.log(`User ${result.rows[0].name} promoted to ${result.rows[0].role}.`);
    process.exit(0);
  } catch (err) {
    console.error("Promotion failed:", err);
    process.exit(1);
  }
}

promote();
