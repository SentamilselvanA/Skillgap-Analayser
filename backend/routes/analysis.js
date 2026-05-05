const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  saveAnalysis,
  getAnalysisHistory,
  deleteAnalysis,
} = require("../controllers/analysisController");

router.post("/", auth, saveAnalysis);
router.get("/", auth, getAnalysisHistory);
router.delete("/:id", auth, deleteAnalysis);

module.exports = router;
