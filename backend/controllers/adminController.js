const User = require("../models/User");
const Skill = require("../models/Skill");
const AnalysisResult = require("../models/AnalysisResult");

// GET /api/admin/users
async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ created_at: -1 });
    return res.json(users);
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
    // Bug fix: Mongoose requires `new: true`, not `returnDocument: "after"`
    const user = await User.findByIdAndUpdate(
      id,
      { is_active: Boolean(is_active) },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("toggleUserStatus error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /api/admin/stats
async function getStats(req, res) {
  try {
    const [userCount, analysisCount, skillCount] = await Promise.all([
      User.countDocuments(),
      AnalysisResult.countDocuments(),
      Skill.countDocuments(),
    ]);

    return res.json({
      users: userCount,
      analyses: analysisCount,
      skills: skillCount,
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { getAllUsers, toggleUserStatus, getStats };
