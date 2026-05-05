-- Skillgap Analyser — PostgreSQL Schema

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL,
  level      VARCHAR(50) NOT NULL DEFAULT 'Intermediate',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id       VARCHAR(100) NOT NULL,
  role_title    VARCHAR(200) NOT NULL,
  score         NUMERIC(5,2) NOT NULL,
  matched_count INTEGER NOT NULL DEFAULT 0,
  total_count   INTEGER NOT NULL DEFAULT 0,
  missing_skills TEXT[] DEFAULT '{}',
  matched_skills TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
