const AnalysisResult = require("../models/AnalysisResult");

// POST /api/analysis — save analysis result
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
    return res
      .status(400)
      .json({ error: "role_id, role_title and score are required" });
  }

  try {
    const result = await AnalysisResult.create({
      user_id: req.user.id,
      role_id,
      role_title,
      score,
      matched_count: matched_count || 0,
      total_count: total_count || 0,
      missing_skills: Array.isArray(missing_skills) ? missing_skills : [],
      matched_skills: Array.isArray(matched_skills) ? matched_skills : [],
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error("saveAnalysis error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /api/analysis — get analysis history for user
async function getAnalysisHistory(req, res) {
  try {
    const history = await AnalysisResult.find({ user_id: req.user.id })
      .sort({ created_at: -1 })
      .limit(50);
    return res.json(history);
  } catch (err) {
    console.error("getAnalysisHistory error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/analysis/:id
async function deleteAnalysis(req, res) {
  const { id } = req.params;
  try {
    const result = await AnalysisResult.findOneAndDelete({
      _id: id,
      user_id: req.user.id,
    });
    if (!result) {
      return res.status(404).json({ error: "Analysis record not found" });
    }
    return res.json({ message: "Deleted", id: result._id.toString() });
  } catch (err) {
    console.error("deleteAnalysis error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { saveAnalysis, getAnalysisHistory, deleteAnalysis };
