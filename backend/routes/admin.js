const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  getAllUsers,
  toggleUserStatus,
  getStats,
} = require("../controllers/adminController");

// All routes here are protected and require admin role
router.get("/users", auth, admin, getAllUsers);
router.patch("/users/:id/status", auth, admin, toggleUserStatus);
router.get("/stats", auth, admin, getStats);

module.exports = router;
