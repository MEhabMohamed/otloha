-- ===========================================================================
-- Otloha Database Schema (PostgreSQL)
-- ===========================================================================
--
-- How to run this schema:
-- 1. Connect to your PostgreSQL instance:
--    psql -U postgres
--
-- 2. Create the database (if it doesn't already exist):
--    CREATE DATABASE otloha;
--
-- 3. Connect to the database and run this file:
--    \c otloha
--    \i schema.sql
--
-- ===========================================================================

-- Drop existing tables to recreate
DROP TABLE IF EXISTS users, admins, recitations, levels, lessons CASCADE;

-- 1. Create Users Table
-- Stores student and teacher profiles
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gender VARCHAR(50),
    avatar TEXT,
    country JSONB,                  -- student/teacher country object
    password VARCHAR(255) NOT NULL,
    description VARCHAR(50) NOT NULL, -- 'student' or 'teacher'
    narration VARCHAR(100),           -- student narration preferences
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
    due VARCHAR(100)                  -- teacher due calculations
);

-- 2. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);

-- 3. Create Recitations Table
-- Stores recitation posts, playback files (base64 or links), and reviews/ratings
CREATE TABLE IF NOT EXISTS recitations (
    id VARCHAR(100) PRIMARY KEY,
    verse JSONB NOT NULL,             -- verse mapping details
    narration VARCHAR(100),
    playback TEXT,                    -- audio link or base64 file data
    authed VARCHAR(100) NOT NULL,     -- author user ID
    status VARCHAR(50) DEFAULT 'Pending',
    raters JSONB DEFAULT '[]'::jsonb,
    "createdAt" BIGINT,
    "evaluatedAt" BIGINT,
    teacher JSONB DEFAULT '{}'::jsonb, -- evaluation teacher details
    remarkable BOOLEAN DEFAULT FALSE,
    report TEXT DEFAULT '',
    reviewed BOOLEAN DEFAULT FALSE,
    closed BOOLEAN DEFAULT FALSE
);

-- 4. Create Tajweed Levels Table
CREATE TABLE IF NOT EXISTS levels (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50),
    value VARCHAR(50)
);

-- 5. Create Tajweed Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    level VARCHAR(100),
    "parentLesson" VARCHAR(100)
);

-- ===========================================================================
-- Default Seed Data
-- ===========================================================================

-- Seed default admin account
INSERT INTO admins (id, email)
VALUES ('mohamedelenna90', 'mohamedelenna90@gmail.com')
ON CONFLICT (id) DO NOTHING;


-- ===========================================================================
-- Database Indexes for Performance Optimization
-- ===========================================================================
CREATE INDEX IF NOT EXISTS idx_users_description ON users(description);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_recitations_authed ON recitations(authed);
CREATE INDEX IF NOT EXISTS idx_recitations_createdAt ON recitations("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_recitations_status ON recitations(status);


-- ===========================================================================
-- Helpful SQL Queries
-- ===========================================================================

-- Find all student accounts:
-- SELECT * FROM users WHERE description = 'student';

-- Find all teacher accounts:
-- SELECT * FROM users WHERE description = 'teacher';

-- Get pending recitations awaiting evaluation:
-- SELECT * FROM recitations WHERE status = 'Pending' ORDER BY "createdAt" DESC;

-- Get all lessons for a specific level:
-- SELECT * FROM lessons WHERE level = 'some-level-id';
