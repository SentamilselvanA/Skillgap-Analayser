const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillgap";

let isConnecting = false;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (isConnecting) return;
  isConnecting = true;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully to:", MONGODB_URI);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    // Bug fix: reset flag on failure so reconnect attempts are not permanently blocked
  } finally {
    isConnecting = false;
  }
}

connectDB();

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting reconnect...");
  connectDB();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err.message);
});

module.exports = { connectDB, connection: mongoose.connection };
