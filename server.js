require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.SERVER_PORT || 5000;

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

let activeSessionUser = null;

// Session management
app.post('/api/session', (req, res) => {
  const { id } = req.body;
  activeSessionUser = id;
  res.json({ success: true, id: activeSessionUser });
});

app.get('/api/session', (req, res) => {
  res.json({ id: activeSessionUser });
});

app.delete('/api/session', (req, res) => {
  activeSessionUser = null;
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
