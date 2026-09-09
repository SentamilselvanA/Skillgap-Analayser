require("dotenv").config();

const express = require("express");
const cors = require("cors");
require("./db");

const authRoutes     = require("./routes/auth");
const skillsRoutes   = require("./routes/skills");
const analysisRoutes = require("./routes/analysis");
const adminRoutes    = require("./routes/admin");
const healthRoutes   = require("./routes/health");

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/health",   healthRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/skills",   skillsRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/admin",    adminRoutes);

// ─── 404 handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Skillgap API running on http://localhost:${PORT}`);
});
