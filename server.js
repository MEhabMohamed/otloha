require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Logger endpoint
app.post('/api/logs', (req, res) => {
  const { action, newState } = req.body;
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ACTION: ${action.type} | Action: ${JSON.stringify(action)} | New State: ${JSON.stringify(newState)}\n`;
  
  try {
    fs.appendFileSync(path.join(__dirname, 'app.log'), logMessage);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to write to app.log:', err);
    res.status(500).json({ error: 'Failed to write log' });
  }
});

// Helper to convert array to object keyed by ID
function toObjectById(rows) {
  const obj = {};
  rows.forEach(row => {
    obj[row.id] = row;
  });
  return obj;
}

// Get initial data
app.get('/api/initial-data', async (req, res) => {
  try {
    const recitationsRes = await pool.query('SELECT * FROM recitations');
    const usersRes = await pool.query('SELECT * FROM users');
    const adminsRes = await pool.query('SELECT * FROM admins');
    const levelsRes = await pool.query('SELECT * FROM levels');
    const lessonsRes = await pool.query('SELECT * FROM lessons');

    const recitations = toObjectById(recitationsRes.rows);
    const users = toObjectById(usersRes.rows);
    const admins = toObjectById(adminsRes.rows);
    const levels = toObjectById(levelsRes.rows);
    const lessons = toObjectById(lessonsRes.rows);

    const teachers = {};
    const students = {};

    Object.values(users).forEach(user => {
      if (user.description === 'teacher') {
        teachers[user.id] = user;
      } else {
        students[user.id] = user;
      }
    });

    res.json({
      recitations,
      users,
      admins,
      students,
      teachers,
      tajweed: {
        levels,
        lessons
      },
      levels,
      lessons
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save level
app.post('/api/tajweed/levels', async (req, res) => {
  const { id, name, color, value } = req.body;
  try {
    await pool.query(
      'INSERT INTO levels (id, name, color, value) VALUES ($1, $2, $3, $4)',
      [id, name, color, value]
    );
    res.json({ id, name, color, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save lesson
app.post('/api/tajweed/lessons', async (req, res) => {
  const { id, title, content, level, parentLesson } = req.body;
  try {
    await pool.query(
      'INSERT INTO lessons (id, title, content, level, "parentLesson") VALUES ($1, $2, $3, $4, $5)',
      [id, title, content, level, parentLesson]
    );
    res.json({ id, title, content, level, parentLesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Edit lesson
app.put('/api/tajweed/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, level, parentLesson } = req.body;
  try {
    await pool.query(
      'UPDATE lessons SET title = $1, content = $2, level = $3, "parentLesson" = $4 WHERE id = $5',
      [title, content, level, parentLesson, id]
    );
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Edit level
app.put('/api/tajweed/levels/:id', async (req, res) => {
  const { id } = req.params;
  const { name, color, value } = req.body;
  try {
    await pool.query(
      'UPDATE levels SET name = $1, color = $2, value = $3 WHERE id = $4',
      [name, color, value, id]
    );
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete level
app.delete('/api/tajweed/levels/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM levels WHERE id = $1', [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete lesson
app.delete('/api/tajweed/lessons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM lessons WHERE id = $1', [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// Delete user (student or teacher)
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete recitation
app.delete('/api/recitations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM recitations WHERE id = $1', [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Helper to generate UID
function generateUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Save recitation
app.post('/api/recitations', async (req, res) => {
  const { verse, narration, playback, authed } = req.body;
  try {
    const userRes = await pool.query('SELECT description FROM users WHERE id = $1', [authed]);
    const isTeacher = userRes.rows.length > 0 && userRes.rows[0].description === 'teacher';
    
    const id = generateUID().replace(/[0-9]/g, 'k');
    const createdAt = Date.now();
    
    let recitation;
    if (isTeacher) {
      recitation = {
        id,
        verse,
        narration,
        playback,
        authed,
        status: 'Accepted',
        raters: [],
        createdAt,
        remarkable: false,
        closed: false
      };
    } else {
      recitation = {
        id,
        verse,
        narration,
        playback,
        authed,
        status: 'Pending',
        raters: [],
        createdAt,
        evaluatedAt: '',
        teacher: { name: '', avatar: '' },
        remarkable: false,
        report: '',
        reviewed: false,
        closed: false
      };
    }

    await pool.query(
      'INSERT INTO recitations (id, verse, narration, playback, authed, status, raters, "createdAt", "evaluatedAt", teacher, remarkable, report, reviewed, closed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      [
        recitation.id,
        JSON.stringify(recitation.verse),
        recitation.narration,
        recitation.playback,
        recitation.authed,
        recitation.status,
        JSON.stringify(recitation.raters),
        recitation.createdAt,
        recitation.evaluatedAt === '' ? null : recitation.evaluatedAt,
        JSON.stringify(recitation.teacher),
        recitation.remarkable,
        recitation.report || '',
        recitation.reviewed || false,
        recitation.closed || false,
      ]
    );

    // Update user's recitations list
    if (userRes.rows.length > 0) {
      const userFullRes = await pool.query('SELECT recitations FROM users WHERE id = $1', [authed]);
      const userRecitations = userFullRes.rows[0].recitations || [];
      userRecitations.push(recitation.id);
      await pool.query('UPDATE users SET recitations = $1 WHERE id = $2', [
        JSON.stringify(userRecitations),
        authed,
      ]);
    }

    res.json(recitation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save student
app.post('/api/users/student', async (req, res) => {
  const user = req.body;
  try {
    await pool.query(
      'INSERT INTO users (id, name, email, gender, avatar, country, password, description, narration, lang, "bDate", status, recitations, "ratedRecitations", "joiningDate", verified, level, active, raters, rated, "blockList") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)',
      [
        user.id,
        user.name,
        user.email,
        user.gender,
        user.avatar,
        JSON.stringify(user.country),
        user.password,
        user.description,
        user.narration,
        user.lang,
        user.bDate,
        user.status,
        JSON.stringify(user.recitations),
        JSON.stringify(user.ratedRecitations),
        user.joiningDate,
        user.verified,
        user.level,
        user.active,
        JSON.stringify(user.raters),
        JSON.stringify(user.rated),
        JSON.stringify(user.blockList),
      ]
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save teacher
app.post('/api/users/teacher', async (req, res) => {
  const user = req.body;
  try {
    await pool.query(
      'INSERT INTO users (id, name, email, gender, avatar, country, password, description, due, lang, "bDate", status, recitations, "evaluatedRecitations", "ratedRecitations", "joiningDate", verified, level, active, raters, rated, earnings, dues, "blockList") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)',
      [
        user.id,
        user.name,
        user.email,
        user.gender,
        user.avatar,
        JSON.stringify(user.country),
        user.password,
        user.description,
        user.due,
        user.lang,
        user.bDate,
        user.status,
        JSON.stringify(user.recitations),
        JSON.stringify(user.evaluatedRecitations),
        JSON.stringify(user.ratedRecitations),
        user.joiningDate,
        user.verified,
        user.level,
        user.active,
        JSON.stringify(user.raters),
        JSON.stringify(user.rated),
        JSON.stringify(user.earnings),
        JSON.stringify(user.dues),
        JSON.stringify(user.blockList),
      ]
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save admin
app.post('/api/admins', async (req, res) => {
  const { id, email } = req.body;
  try {
    await pool.query('INSERT INTO admins (id, email) VALUES ($1, $2)', [id, email]);
    res.json({ id, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete admin
app.delete('/api/admins/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM admins WHERE id = $1', [id]);
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update password
app.put('/api/users/:id/password', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [password, id]);
    res.json({ password });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update user ratings
app.post('/api/ratings/user', async (req, res) => {
  const { raterId, ratedId, rating } = req.body;
  try {
    // 1. Update rated user's raters
    const ratedRes = await pool.query('SELECT raters FROM users WHERE id = $1', [ratedId]);
    if (ratedRes.rows.length > 0) {
      const raters = ratedRes.rows[0].raters || [];
      raters.push({ raterId, rating });
      await pool.query('UPDATE users SET raters = $1 WHERE id = $2', [
        JSON.stringify(raters),
        ratedId,
      ]);
    }

    // 2. Update rater's rated list
    const raterRes = await pool.query('SELECT rated FROM users WHERE id = $1', [raterId]);
    if (raterRes.rows.length > 0) {
      const rated = raterRes.rows[0].rated || [];
      rated.push(ratedId);
      await pool.query('UPDATE users SET rated = $1 WHERE id = $2', [
        JSON.stringify(rated),
        raterId,
      ]);
    }

    res.json({ raterId, ratedId, rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update recitation ratings
app.post('/api/ratings/recitation', async (req, res) => {
  const { raterId, ratedId, rating } = req.body;
  try {
    // 1. Update recitation's raters
    const recRes = await pool.query('SELECT raters FROM recitations WHERE id = $1', [ratedId]);
    if (recRes.rows.length > 0) {
      const raters = recRes.rows[0].raters || [];
      raters.push({ raterId, rating });
      await pool.query('UPDATE recitations SET raters = $1 WHERE id = $2', [
        JSON.stringify(raters),
        ratedId,
      ]);
    }

    // 2. Update rater's ratedRecitations list
    const raterRes = await pool.query('SELECT "ratedRecitations" FROM users WHERE id = $1', [
      raterId,
    ]);
    if (raterRes.rows.length > 0) {
      const ratedRecitations = raterRes.rows[0].ratedRecitations || [];
      ratedRecitations.push(ratedId);
      await pool.query('UPDATE users SET "ratedRecitations" = $1 WHERE id = $2', [
        JSON.stringify(ratedRecitations),
        raterId,
      ]);
    }

    res.json({ raterId, ratedId, rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update avatar
app.put('/api/users/:id/avatar', async (req, res) => {
  const { id } = req.params;
  const { pic } = req.body;
  try {
    await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [pic, id]);
    res.json({ pic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save blocks
app.post('/api/blocks', async (req, res) => {
  const { id, authed } = req.body;
  try {
    const authRes = await pool.query('SELECT description, "blockList" FROM users WHERE id = $1', [
      authed,
    ]);
    if (authRes.rows.length > 0) {
      const { description, blockList } = authRes.rows[0];
      const updatedBlockList = blockList || [];
      updatedBlockList.push(id);

      await pool.query('UPDATE users SET "blockList" = $1 WHERE id = $2', [
        JSON.stringify(updatedBlockList),
        authed,
      ]);

      if (description === 'teacher') {
        // block student (make student inactive)
        await pool.query('UPDATE users SET active = false WHERE id = $1', [id]);
      }
    }
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save unblocks
app.post('/api/unblocks', async (req, res) => {
  const { id, authed } = req.body;
  try {
    const authRes = await pool.query('SELECT description, "blockList" FROM users WHERE id = $1', [
      authed,
    ]);
    if (authRes.rows.length > 0) {
      const { description, blockList } = authRes.rows[0];
      const updatedBlockList = (blockList || []).filter(item => item !== id);

      await pool.query('UPDATE users SET "blockList" = $1 WHERE id = $2', [
        JSON.stringify(updatedBlockList),
        authed,
      ]);

      if (description === 'teacher') {
        // activate student
        await pool.query('UPDATE users SET active = true WHERE id = $1', [id]);
      }
    }
    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save evaluation
app.post('/api/evaluations', async (req, res) => {
  const { id, authed, status, name, avatar, report } = req.body;
  try {
    const now = Date.now();
    // 1. Update recitation
    await pool.query(
      'UPDATE recitations SET "evaluatedAt" = $1, status = $2, teacher = $3, report = $4 WHERE id = $5',
      [now, status, JSON.stringify({ name, avatar }), report, id]
    );

    // 2. Update teacher's evaluatedRecitations
    const teacherRes = await pool.query('SELECT "evaluatedRecitations" FROM users WHERE id = $1', [
      authed,
    ]);
    if (teacherRes.rows.length > 0) {
      const evaluated = teacherRes.rows[0].evaluatedRecitations || [];
      evaluated.push(id);
      await pool.query('UPDATE users SET "evaluatedRecitations" = $1 WHERE id = $2', [
        JSON.stringify(evaluated),
        authed,
      ]);
    }

    res.json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Save teacher evaluation status
app.put('/api/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', [status, id]);
    res.json({ id, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'otloha-super-secret-key-1234567890';

// Simple JWT-like tokens using HMAC SHA256
function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

// Cookie parser helper
function getCookie(req, name) {
  const rc = req.headers.cookie;
  if (!rc) return null;
  const cookies = rc.split(';').reduce((acc, cookie) => {
    const parts = cookie.split('=');
    acc[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    return acc;
  }, {});
  return cookies[name] || null;
}

const MOCK_PROFILES = {
  google: {
    id: 'google_mock_user',
    name: 'Google Student',
    email: 'google.student@gmail.com',
    avatar: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
    description: 'student',
    gender: 'male',
  },
  facebook: {
    id: 'facebook_mock_user',
    name: 'Facebook Student',
    email: 'facebook.student@gmail.com',
    avatar: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
    description: 'student',
    gender: 'female',
  },
  twitter: {
    id: 'twitter_mock_user',
    name: 'Twitter Student',
    email: 'twitter.student@gmail.com',
    avatar: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
    description: 'student',
    gender: 'male',
  }
};

// OTP Cache
const otps = {};

// Transporter configuration for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohamedelenna90@gmail.com',
    pass: 'qdecspuiswnacxdm'
  }
});

// Endpoint to send OTP code
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiry to 5 minutes
  otps[email] = {
    code,
    expires: Date.now() + 5 * 60 * 1000
  };

  const mailOptions = {
    from: 'mohamedelenna90@gmail.com',
    to: email,
    subject: 'Verification Code to Reveal Password',
    text: `Your verification code is: ${code}. It is valid for 5 minutes.`,
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>It is valid for 5 minutes.</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
});

// Endpoint to verify OTP code
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required' });
  }

  const record = otps[email];
  if (!record) {
    return res.status(400).json({ error: 'No verification code sent to this email' });
  }

  if (Date.now() > record.expires) {
    delete otps[email];
    return res.status(400).json({ error: 'Verification code expired' });
  }

  if (record.code !== code.trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

// Clear OTP on success
  delete otps[email];
  res.json({ success: true });
});

// Forgot password request endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    const user = userRes.rows[0];
    // Generate timed token (expires in 1 hour)
    const token = signToken({ id: user.id, email, exp: Date.now() + 60 * 60 * 1000, purpose: 'reset' });
    const origin = req.get('origin') || 'http://localhost:3000';
    const resetLink = `${origin}/reset-password?token=${token}`;

    const mailOptions = {
      from: 'mohamedelenna90@gmail.com',
      to: email,
      subject: 'Reset Password Request',
      text: `To reset your password, please click the following link: ${resetLink}. It is valid for 1 hour.`,
      html: `<p>To reset your password, please click the link below:</p><p><a href="${resetLink}">${resetLink}</a></p><p>It is valid for 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }
  const payload = verifyToken(token);
  if (!payload || payload.purpose !== 'reset') {
    return res.status(400).json({ error: 'Invalid or expired password reset token' });
  }
  try {
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [password, payload.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Update profile details endpoint
app.put('/api/users/:id/profile', async (req, res) => {
  const { id } = req.params;
  const { name, lang, narration, due } = req.body;
  try {
    const fields = [];
    const values = [];
    
    if (name !== undefined) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(name);
    }
    if (lang !== undefined) {
      fields.push(`lang = $${fields.length + 1}`);
      values.push(lang);
    }
    if (narration !== undefined) {
      fields.push(`narration = $${fields.length + 1}`);
      values.push(narration);
    }
    if (due !== undefined) {
      fields.push(`due = $${fields.length + 1}`);
      values.push(due);
    }
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = 'UPDATE users SET ' + fields.join(', ') + ` WHERE id = $${values.length}`;
    
    await pool.query(query, values);
    res.json({ id, name, lang, narration, due });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Social token endpoint
app.get('/api/auth/social-token', (req, res) => {
  const { provider } = req.query;
  const profile = MOCK_PROFILES[provider];
  if (!profile) {
    return res.status(400).json({ error: 'Invalid social provider' });
  }
  const payload = {
    ...profile,
    exp: Date.now() + 24 * 60 * 60 * 1000
  };
  const token = signToken(payload);
  res.json({ token });
});

// Social login endpoint
app.post('/api/auth/social-login', async (req, res) => {
  const { token } = req.body;
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired social token' });
  }

  try {
    const userExist = await pool.query('SELECT * FROM users WHERE id = $1', [payload.id]);
    if (userExist.rows.length === 0) {
      const defaultCountry = { code: 'US', label: 'United States', phone: '1' };
      await pool.query(
        'INSERT INTO users (id, name, email, gender, avatar, country, password, description, narration, lang, "bDate", status, recitations, "ratedRecitations", "joiningDate", verified, level, active, raters, rated, "blockList") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)',
        [
          payload.id,
          payload.name,
          payload.email,
          payload.gender,
          payload.avatar,
          JSON.stringify(defaultCountry),
          'social_login_no_password',
          payload.description,
          'Hafs',
          'enUS',
          String(Date.now()),
          'Active',
          '[]',
          '[]',
          Date.now(),
          true,
          'Beginner',
          true,
          '[]',
          '[]',
          '[]'
        ]
      );
    }

    const sessionPayload = {
      id: payload.id,
      exp: Date.now() + 24 * 60 * 60 * 1000
    };
    const sessionToken = signToken(sessionPayload);
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [payload.id]);
    const user = userRes.rows[0];

    res.json({ success: true, id: payload.id, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Real Google login endpoint (exchanges auth code, checks user existence)
app.post('/api/auth/google-login', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const tokenRes = await fetch(process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Google token exchange error:', errorText);
      return res.status(tokenRes.status).json({ error: 'Failed to exchange Google code' });
    }

    const tokens = await tokenRes.json();

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileRes.ok) {
      return res.status(profileRes.status).json({ error: 'Failed to fetch Google profile' });
    }

    const profile = await profileRes.json();
    const userId = `google_${profile.sub}`;

    const userExist = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userExist.rows.length > 0) {
      const user = userExist.rows[0];
      const sessionPayload = {
        id: userId,
        exp: Date.now() + 24 * 60 * 60 * 1000
      };
      const sessionToken = signToken(sessionPayload);
      res.cookie('session_token', sessionToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      return res.json({ registered: true, id: userId, user });
    } else {
      return res.json({
        registered: false,
        id: userId,
        profile: {
          name: profile.name,
          email: profile.email,
          avatar: profile.picture || ''
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Real Google register endpoint (saves onboarding profile)
app.post('/api/auth/google-register', async (req, res) => {
  const { id, name, email, avatar, gender, country, description, narration, lang, bDate, due } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (id, name, email, gender, avatar, country, password, description, narration, lang, "bDate", status, recitations, "ratedRecitations", "joiningDate", verified, level, active, raters, rated, "blockList", due) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)',
      [
        id,
        name,
        email,
        gender,
        avatar,
        JSON.stringify(country),
        'social_login_no_password',
        description,
        narration,
        lang,
        bDate,
        'Active',
        '[]',
        '[]',
        Date.now(),
        true,
        'Beginner',
        true,
        '[]',
        '[]',
        '[]',
        due
      ]
    );

    const sessionPayload = {
      id,
      exp: Date.now() + 24 * 60 * 60 * 1000
    };
    const sessionToken = signToken(sessionPayload);
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = userRes.rows[0];

    res.json({ success: true, id, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Real Facebook login endpoint (exchanges auth code, checks user existence)
app.post('/api/auth/facebook-login', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token?' + new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID || '',
      redirect_uri: 'http://localhost:3000',
      client_secret: process.env.FACEBOOK_APP_SECRET || '',
      code,
    }));

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Facebook token exchange error:', errorText);
      return res.status(tokenRes.status).json({ error: 'Failed to exchange Facebook code' });
    }

    const tokens = await tokenRes.json();

    const profileRes = await fetch('https://graph.facebook.com/me?' + new URLSearchParams({
      fields: 'id,name,email,picture.type(large)',
      access_token: tokens.access_token,
    }));

    if (!profileRes.ok) {
      return res.status(profileRes.status).json({ error: 'Failed to fetch Facebook profile' });
    }

    const profile = await profileRes.json();
    const userId = `facebook_${profile.id}`;

    const userExist = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userExist.rows.length > 0) {
      const user = userExist.rows[0];
      const sessionPayload = {
        id: userId,
        exp: Date.now() + 24 * 60 * 60 * 1000
      };
      const sessionToken = signToken(sessionPayload);
      res.cookie('session_token', sessionToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      return res.json({ registered: true, id: userId, user });
    } else {
      return res.json({
        registered: false,
        id: userId,
        profile: {
          name: profile.name,
          email: profile.email || '',
          avatar: profile.picture?.data?.url || ''
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Real Facebook register endpoint (saves onboarding profile)
app.post('/api/auth/facebook-register', async (req, res) => {
  const { id, name, email, avatar, gender, country, description, narration, lang, bDate, due } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (id, name, email, gender, avatar, country, password, description, narration, lang, "bDate", status, recitations, "ratedRecitations", "joiningDate", verified, level, active, raters, rated, "blockList", due) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)',
      [
        id,
        name,
        email,
        gender,
        avatar,
        JSON.stringify(country),
        'social_login_no_password',
        description,
        narration,
        lang,
        bDate,
        'Active',
        '[]',
        '[]',
        Date.now(),
        true,
        'Beginner',
        true,
        '[]',
        '[]',
        '[]',
        due
      ]
    );

    const sessionPayload = {
      id,
      exp: Date.now() + 24 * 60 * 60 * 1000
    };
    const sessionToken = signToken(sessionPayload);
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = userRes.rows[0];

    res.json({ success: true, id, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Real Twitter login endpoint (exchanges auth code, checks user existence)
app.post('/api/auth/twitter-login', async (req, res) => {
  const { code, codeVerifier } = req.body;
  if (!code || !codeVerifier) {
    return res.status(400).json({ error: 'Code and codeVerifier are required' });
  }

  try {
    const authHeader = 'Basic ' + Buffer.from(`${process.env.TWITTER_CLIENT_ID || ''}:${process.env.TWITTER_CLIENT_SECRET || ''}`).toString('base64');
    
    const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000',
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Twitter token exchange error:', errorText);
      return res.status(tokenRes.status).json({ error: 'Failed to exchange Twitter code' });
    }

    const tokens = await tokenRes.json();

    const profileRes = await fetch('https://api.twitter.com/2/users/me?' + new URLSearchParams({
      'user.fields': 'profile_image_url,username,name',
    }), {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileRes.ok) {
      return res.status(profileRes.status).json({ error: 'Failed to fetch Twitter profile' });
    }

    const responseData = await profileRes.json();
    const profile = responseData.data;
    if (!profile) {
      return res.status(500).json({ error: 'No user profile data returned from Twitter' });
    }

    const userId = `twitter_${profile.id}`;

    const userExist = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userExist.rows.length > 0) {
      const user = userExist.rows[0];
      const sessionPayload = {
        id: userId,
        exp: Date.now() + 24 * 60 * 60 * 1000
      };
      const sessionToken = signToken(sessionPayload);
      res.cookie('session_token', sessionToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      return res.json({ registered: true, id: userId, user });
    } else {
      const avatarUrl = profile.profile_image_url ? profile.profile_image_url.replace('_normal', '_400x400') : '';
      return res.json({
        registered: false,
        id: userId,
        profile: {
          name: profile.name || profile.username,
          email: `${profile.username || 'twitter_user'}@twitter.com`,
          avatar: avatarUrl,
        }
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Real Twitter register endpoint (saves onboarding profile)
app.post('/api/auth/twitter-register', async (req, res) => {
  const { id, name, email, avatar, gender, country, description, narration, lang, bDate, due } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (id, name, email, gender, avatar, country, password, description, narration, lang, "bDate", status, recitations, "ratedRecitations", "joiningDate", verified, level, active, raters, rated, "blockList", due) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)',
      [
        id,
        name,
        email,
        gender,
        avatar,
        JSON.stringify(country),
        'social_login_no_password',
        description,
        narration,
        lang,
        bDate,
        'Active',
        '[]',
        '[]',
        Date.now(),
        true,
        'Beginner',
        true,
        '[]',
        '[]',
        '[]',
        due
      ]
    );

    const sessionPayload = {
      id,
      exp: Date.now() + 24 * 60 * 60 * 1000
    };
    const sessionToken = signToken(sessionPayload);
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = userRes.rows[0];

    res.json({ success: true, id, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Session management
app.post('/api/session', (req, res) => {
  const { id } = req.body;
  const sessionPayload = {
    id,
    exp: Date.now() + 24 * 60 * 60 * 1000
  };
  const sessionToken = signToken(sessionPayload);
  res.cookie('session_token', sessionToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });
  res.json({ success: true, id });
});

app.get('/api/session', (req, res) => {
  const token = getCookie(req, 'session_token');
  const payload = verifyToken(token);
  if (payload) {
    res.json({ id: payload.id });
  } else {
    res.json({ id: null });
  }
});

app.delete('/api/session', (req, res) => {
  res.clearCookie('session_token', { path: '/' });
  res.json({ success: true });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
