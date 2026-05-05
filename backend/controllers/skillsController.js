const pool = require("../db");

// GET /api/skills
async function getSkills(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, level, created_at FROM skills WHERE user_id = $1 ORDER BY created_at ASC",
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("getSkills error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /api/skills  — add single skill
async function addSkill(req, res) {
  const { name, level = "Intermediate" } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  const validLevels = ["Beginner", "Intermediate", "Advanced"];
  if (!validLevels.includes(level)) {
    return res.status(400).json({ error: `level must be one of: ${validLevels.join(", ")}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO skills (user_id, name, level)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, name) DO UPDATE SET level = EXCLUDED.level
       RETURNING id, name, level, created_at`,
      [req.user.id, name.trim(), level]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("addSkill error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/skills/:id
async function deleteSkill(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Skill not found" });
    }
    return res.json({ message: "Skill deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("deleteSkill error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// PUT /api/skills  — bulk replace all skills for user
async function bulkReplaceSkills(req, res) {
  const { skills } = req.body; // expects [{ name, level }]

  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "skills must be an array" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM skills WHERE user_id = $1", [req.user.id]);

    const inserted = [];
    for (const skill of skills) {
      if (!skill.name) continue;
      const r = await client.query(
        `INSERT INTO skills (user_id, name, level) VALUES ($1, $2, $3)
         ON CONFLICT (user_id, name) DO UPDATE SET level = EXCLUDED.level
         RETURNING id, name, level`,
        [req.user.id, skill.name.trim(), skill.level || "Intermediate"]
      );
      inserted.push(r.rows[0]);
    }

    await client.query("COMMIT");
    return res.json(inserted);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("bulkReplaceSkills error:", err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
}

module.exports = { getSkills, addSkill, deleteSkill, bulkReplaceSkills };
