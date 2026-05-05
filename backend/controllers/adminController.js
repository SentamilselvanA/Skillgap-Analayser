const pool = require("../db");

// GET /api/admin/users
async function getAllUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC"
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// PATCH /api/admin/users/:id/status
async function toggleUserStatus(req, res) {
  const { id } = req.params;
  const { is_active } = req.body;

  if (is_active === undefined) {
    return res.status(400).json({ error: "is_active status is required" });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, is_active",
      [is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("toggleUserStatus error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const userCount = await pool.query("SELECT COUNT(*) FROM users");
    const analysisCount = await pool.query("SELECT COUNT(*) FROM analysis_results");
    const skillCount = await pool.query("SELECT COUNT(*) FROM skills");

    return res.json({
      users: parseInt(userCount.rows[0].count),
      analyses: parseInt(analysisCount.rows[0].count),
      skills: parseInt(skillCount.rows[0].count),
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getAllUsers, toggleUserStatus, getStats };
