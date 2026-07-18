require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const schema = `
-- Drop existing tables to recreate with correct camelCase columns
DROP TABLE IF EXISTS users, admins, recitations, levels, lessons CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    avatar TEXT,
    country JSONB,
    password VARCHAR(255) NOT NULL,
    description VARCHAR(50) NOT NULL, -- 'student' or 'teacher'
    narration VARCHAR(100),
    lang VARCHAR(50),
    "bDate" VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    recitations JSONB DEFAULT '[]'::jsonb,
    "evaluatedRecitations" JSONB DEFAULT '[]'::jsonb,
    "ratedRecitations" JSONB DEFAULT '[]'::jsonb,
    "joiningDate" BIGINT,
    verified BOOLEAN DEFAULT FALSE,
    level VARCHAR(50) DEFAULT 'Beginner',
    active BOOLEAN DEFAULT TRUE,
    raters JSONB DEFAULT '[]'::jsonb,
    rated JSONB DEFAULT '[]'::jsonb,
    earnings JSONB DEFAULT '[0]'::jsonb,
    dues JSONB DEFAULT '[0]'::jsonb,
    "blockList" JSONB DEFAULT '[]'::jsonb,
    due VARCHAR(100)
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);

-- Create recitations table
CREATE TABLE IF NOT EXISTS recitations (
    id VARCHAR(100) PRIMARY KEY,
    verse JSONB NOT NULL,
    narration VARCHAR(100),
    playback TEXT,
    authed VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    raters JSONB DEFAULT '[]'::jsonb,
    "createdAt" BIGINT,
    "evaluatedAt" BIGINT,
    teacher JSONB DEFAULT '{}'::jsonb,
    remarkable BOOLEAN DEFAULT FALSE,
    report TEXT DEFAULT '',
    reviewed BOOLEAN DEFAULT FALSE,
    closed BOOLEAN DEFAULT FALSE
);

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    value VARCHAR(50)
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    level VARCHAR(100),
    "parentLesson" VARCHAR(100)
);

-- Seed default admin
INSERT INTO admins (id, email)
VALUES ('mohamedelenna90', 'mohamedelenna90@gmail.com')
ON CONFLICT (id) DO NOTHING;

-- Database Indexes for Performance Optimization
CREATE INDEX IF NOT EXISTS idx_users_description ON users(description);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_recitations_authed ON recitations(authed);
CREATE INDEX IF NOT EXISTS idx_recitations_createdAt ON recitations("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_recitations_status ON recitations(status);
`;

async function init() {
  console.log('Re-initializing database tables with case-preserving column names...');
  try {
    await pool.query(schema);
    console.log('Database tables re-initialized successfully!');
  } catch (err) {
    console.error('Error re-initializing database tables:', err);
  } finally {
    await pool.end();
  }
}

init();
