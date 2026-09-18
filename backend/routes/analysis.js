const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  groqAnalyze,
  saveAnalysis,
  getAnalysisHistory,
  deleteAnalysis,
} = require("../controllers/analysisController");

// AI-powered role gap analysis + roadmap (no auth — guests can use it too)
router.post("/groq-analyze", groqAnalyze);

// Saved history (auth required)
router.post("/", auth, saveAnalysis);
router.get("/", auth, getAnalysisHistory);
router.delete("/:id", auth, deleteAnalysis);

module.exports = router;
