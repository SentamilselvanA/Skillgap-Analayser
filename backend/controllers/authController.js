const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role, is_active, created_at",
      [name.trim(), email.toLowerCase(), password_hash]
    );

    const user = result.rows[0];
    const token = signToken(user);

    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, role, is_active, password_hash FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    
    if (!user.is_active) {
      return res.status(403).json({ error: "Your account is deactivated. Please contact admin." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /api/auth/me  (protected)
async function me(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    
    const user = result.rows[0];
    if (!user.is_active) {
      return res.status(403).json({ error: "Account deactivated" });
    }

    return res.json(user);
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}


module.exports = { register, login, me };
