const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { db, runMigrations, closeKnex } = require('../lib/knex/knex');

const scryptAsync = promisify(crypto.scrypt);
const ROOT = path.resolve(__dirname, '../..');

async function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scryptAsync(String(plain), salt, 64);
  return `scrypt$${salt}$${derived.toString('hex')}`;
}

const SEEDED_USERS = [
  { name: 'Otloha Platform Admin', email: 'admin.ops@otloha.local', password: 'Otl!Admin#2026$D9', role: 'admin' },
  { name: 'Otloha Tajweed Teacher', email: 'teacher.ops@otloha.local', password: 'Otl!Teach#2026$F3', role: 'teacher' },
  { name: 'Otloha Quran Student', email: 'student.ops@otloha.local', password: 'Otl!Stud#2026$G6', role: 'student' },
];

async function seedUsers() {
  await runMigrations();
  await db('users').whereIn('email', SEEDED_USERS.map((u) => u.email)).del();
  for (const u of SEEDED_USERS) {
    const hash = await hashPassword(u.password);
    await db('users').insert({ name: u.name, email: u.email, password_hash: hash, role: u.role });
  }
  const md = [
    '# Seeded Users — `otloha`',
    '',
    '> **DO NOT COMMIT THIS FILE.** Listed in `.gitignore`.',
    '',
    '| Role | Name | Email | Password |',
    '|---|---|---|---|',
    ...SEEDED_USERS.map((u) => `| \`${u.role}\` | ${u.name} | \`${u.email}\` | \`${u.password}\` |`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, 'SEEDED_USERS.md'), md, 'utf8');
  console.log(`Seeded ${SEEDED_USERS.length} users for otloha`);
}

if (require.main === module) {
  seedUsers().then(() => closeKnex()).catch(async (e) => { console.error(e.message); await closeKnex(); process.exit(1); });
}

