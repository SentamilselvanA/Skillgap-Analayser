const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getSkills,
  addSkill,
  deleteSkill,
  bulkReplaceSkills,
} = require("../controllers/skillsController");

router.get("/", auth, getSkills);
router.post("/", auth, addSkill);
router.put("/", auth, bulkReplaceSkills);
router.delete("/:id", auth, deleteSkill);

module.exports = router;
