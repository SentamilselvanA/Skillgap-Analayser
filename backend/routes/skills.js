const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const {
  getSkills,
  addSkill,
  addMultipleSkills,
  deleteSkill,
  bulkReplaceSkills,
  uploadResume,
  parseResumeText,
} = require("../controllers/skillsController");

// Configure multer with memory storage (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/", auth, getSkills);
router.post("/", auth, addSkill);
router.post("/batch", auth, addMultipleSkills);
router.put("/", auth, bulkReplaceSkills);
router.delete("/:id", auth, deleteSkill);

// Resume parsing endpoints
router.post("/upload-resume", upload.single("resume"), uploadResume);
router.post("/parse-text", parseResumeText);

module.exports = router;
