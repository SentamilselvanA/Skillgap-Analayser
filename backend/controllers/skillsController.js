const Skill = require("../models/Skill");
const { extractTextFromPDF } = require("../utils/pdfExtractor");
const mammoth = require("mammoth");
const { extractSkillsFromText } = require("../utils/extractSkills");
const { analyzeResumeWithGroq } = require("../utils/groqAnalyzer");

// GET /api/skills
async function getSkills(req, res) {
  try {
    const skills = await Skill.find({ user_id: req.user.id }).sort({
      created_at: 1,
    });
    return res.json(skills);
  } catch (err) {
    console.error("getSkills error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /api/skills — add single skill
async function addSkill(req, res) {
  const { name, level = "Intermediate" } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  const validLevels = ["Beginner", "Intermediate", "Advanced"];
  if (!validLevels.includes(level)) {
    return res
      .status(400)
      .json({ error: `level must be one of: ${validLevels.join(", ")}` });
  }

  try {
    const skill = await Skill.findOneAndUpdate(
      { user_id: req.user.id, name: name.trim() },
      { level },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
    return res.status(201).json(skill);
  } catch (err) {
    console.error("addSkill error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /api/skills/batch — add multiple skills (upsert)
async function addMultipleSkills(req, res) {
  const { skills } = req.body; // expects [{ name, level }]

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "skills must be a non-empty array" });
  }

  try {
    const results = [];
    for (const item of skills) {
      if (!item || !item.name || !item.name.trim()) continue;
      const validLevels = ["Beginner", "Intermediate", "Advanced"];
      const level = validLevels.includes(item.level) ? item.level : "Intermediate";

      const skill = await Skill.findOneAndUpdate(
        { user_id: req.user.id, name: item.name.trim() },
        { level },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
      results.push(skill);
    }
    return res.status(201).json(results);
  } catch (err) {
    console.error("addMultipleSkills error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /api/skills/:id
async function deleteSkill(req, res) {
  const { id } = req.params;

  try {
    const skill = await Skill.findOneAndDelete({
      _id: id,
      user_id: req.user.id,
    });
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    return res.json({ message: "Skill deleted", id: skill._id.toString() });
  } catch (err) {
    console.error("deleteSkill error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// PUT /api/skills — bulk replace all skills for user
async function bulkReplaceSkills(req, res) {
  const { skills } = req.body; // expects [{ name, level }]

  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "skills must be an array" });
  }

  try {
    await Skill.deleteMany({ user_id: req.user.id });

    const toInsert = skills
      .filter((s) => s && s.name && s.name.trim())
      .map((s) => ({
        user_id: req.user.id,
        name: s.name.trim(),
        level: s.level || "Intermediate",
      }));

    let inserted = [];
    if (toInsert.length > 0) {
      inserted = await Skill.insertMany(toInsert);
    }

    return res.json(inserted);
  } catch (err) {
    console.error("bulkReplaceSkills error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /api/skills/upload-resume — extract text and detect skills with Groq AI
async function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No resume file provided" });
  }

  try {
    let text = "";
    const originalName = req.file.originalname || "";
    const mimeType = req.file.mimetype || "";
    const ext = originalName.toLowerCase().split(".").pop();

    if (ext === "pdf" || mimeType === "application/pdf") {
      // Use the robust extractTextFromPDF helper (handles pdf-parse v1 & v2)
      text = await extractTextFromPDF(req.file.buffer);
    } else if (
      ext === "docx" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = parsed.value;
    } else {
      text = req.file.buffer.toString("utf-8");
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Could not extract readable text from the uploaded file.",
      });
    }

    const analysis = await analyzeResumeWithGroq(text);

    return res.json({
      filename: originalName,
      detectedSkills: analysis.skills,
      summary: analysis.summary,
      isAiExtracted: analysis.isAiExtracted,
      totalDetected: analysis.skills.length,
      preview: text.trim().slice(0, 300),
    });
  } catch (err) {
    console.error("uploadResume error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to parse resume" });
  }
}

// POST /api/skills/parse-text — extract skills from pasted resume text with Groq AI
async function parseResumeText(req, res) {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const analysis = await analyzeResumeWithGroq(text);

    return res.json({
      detectedSkills: analysis.skills,
      summary: analysis.summary,
      isAiExtracted: analysis.isAiExtracted,
      totalDetected: analysis.skills.length,
      preview: text.trim().slice(0, 300),
    });
  } catch (err) {
    console.error("parseResumeText error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Server error" });
  }
}

module.exports = {
  getSkills,
  addSkill,
  addMultipleSkills,
  deleteSkill,
  bulkReplaceSkills,
  uploadResume,
  parseResumeText,
};
