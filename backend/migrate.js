const pool = require("./db");

async function migrate() {
  try {
    console.log("Checking for columns...");
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    `);
    console.log("Migration successful!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
