exports.up = async function up(knex) {
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(180) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS otps (
      email VARCHAR(180) PRIMARY KEY,
      code VARCHAR(16) NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS data_deletion_requests (
      id SERIAL PRIMARY KEY,
      email VARCHAR(180) NULL,
      provider VARCHAR(60) NOT NULL DEFAULT 'direct',
      reason TEXT NULL,
      confirmation_code VARCHAR(40) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGSERIAL PRIMARY KEY,
      action_type VARCHAR(120) NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
};

exports.down = async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS audit_logs CASCADE;
    DROP TABLE IF EXISTS data_deletion_requests CASCADE;
    DROP TABLE IF EXISTS otps CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `);
};

