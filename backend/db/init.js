const fs = require("fs");
const path = require("path");
const pool = require("./index");

async function init() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  try {
    await pool.query(sql);
    console.log("✅ Database schema initialised successfully.");
  } catch (err) {
    console.error("❌ Failed to initialise schema:", err.message);
  } finally {
    await pool.end();
  }
}

init();
