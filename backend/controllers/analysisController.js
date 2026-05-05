const pool = require("../db");

// POST /api/analysis  — save analysis result
async function saveAnalysis(req, res) {
  const {
    role_id,
    role_title,
    score,
    matched_count,
    total_count,
    missing_skills = [],
    matched_skills = [],
  } = req.body;

  if (!role_id || !role_title || score === undefined) {
    return res.status(400).json({ error: "role_id, role_title and score are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO analysis_results
         (user_id, role_id, role_title, score, matched_count, total_count, missing_skills, matched_skills)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.id,
        role_id,
        role_title,
        score,
        matched_count || 0,
        total_count || 0,
        missing_skills,
        matched_skills,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("saveAnalysis error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /api/analysis  — get analysis history for user
async function getAnalysisHistory(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, role_id, role_title, score, matched_count, total_count,
              missing_skills, matched_skills, created_at
       FROM analysis_results
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("getAnalysisHistory error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/analysis/:id
async function deleteAnalysis(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM analysis_results WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Analysis record not found" });
    }
    return res.json({ message: "Deleted", id: result.rows[0].id });
  } catch (err) {
    console.error("deleteAnalysis error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { saveAnalysis, getAnalysisHistory, deleteAnalysis };
