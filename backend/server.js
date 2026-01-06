const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = require('./db'); // ✅ SINGLE Neon connection

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  name: 'art_roadmap_session',
  secret: process.env.SESSION_SECRET || 'art-is-life-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - User: ${req.session.userId || 'guest'}`);
  next();
});

// ==================== AUTH HELPERS ====================

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const optionalAuth = (req, res, next) => next();

// ==================== AUTH ROUTES ====================

// Signup
app.post('/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, username, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, username`,
      [firstName, lastName, email, username, passwordHash]
    );

    const user = result.rows[0];
    req.session.userId = user.id;

    res.cookie('user_info', JSON.stringify(user), {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [emailOrUsername]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;

    res.cookie('user_info', JSON.stringify({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      username: user.username
    }), {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('art_roadmap_session');
    res.clearCookie('user_info');
    res.json({ success: true });
  });
});

// ==================== FORUM ROUTES ====================

// Get all categories
app.get('/api/forum/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create post (THIS fixes + New Discussion)
app.post('/api/forum/posts', requireAuth, async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;

    const result = await pool.query(
      `INSERT INTO forum_posts (user_id, category_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.session.userId, categoryId, title, content]
    );

    res.status(201).json({
      success: true,
      postId: result.rows[0].id
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts
app.get('/api/forum/posts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username as author, c.name as category_name,
      (SELECT COUNT(*) FROM forum_replies r WHERE r.post_id = p.id) as reply_count
      FROM forum_posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json({ posts: result.rows });
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post with replies
app.get('/api/forum/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get post
    const postResult = await pool.query(`
      SELECT p.*, u.username as author, c.name as category_name
      FROM forum_posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get replies
    const repliesResult = await pool.query(`
      SELECT r.*, u.username as author
      FROM forum_replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.post_id = $1
      ORDER BY r.created_at ASC
    `, [id]);

    res.json({
      post: postResult.rows[0],
      replies: repliesResult.rows
    });
  } catch (err) {
    console.error('Fetch post detail error:', err);
    res.status(500).json({ error: 'Failed to fetch post details' });
  }
});

// Create reply
app.post('/api/forum/posts/:id/replies', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    const result = await pool.query(
      `INSERT INTO forum_replies (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [id, req.session.userId, content]
    );

    // Fetch the username for response
    const userResult = await pool.query('SELECT username FROM users WHERE id = $1', [req.session.userId]);

    res.status(201).json({
      success: true,
      reply: {
        ...result.rows[0],
        author: userResult.rows[0].username
      }
    });
  } catch (err) {
    console.error('Create reply error:', err);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

// ==================== HEALTH ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    authenticated: !!req.session.userId,
    timestamp: new Date().toISOString()
  });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

(async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('🟢 Neon Postgres connected at:', res.rows[0].now);
    
    // Ensure tables exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id INTEGER REFERENCES users(id),
        course_id VARCHAR(50) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, course_id)
      );
    `);
    console.log('✅ Progress table ready');
    
    client.release();
  } catch (err) {
    console.error('🔴 Neon Postgres connection failed:', err.message);
  }
})();

// ==================== PROGRESS ROUTES ====================

app.get('/api/progress', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT course_id FROM user_progress WHERE user_id = $1',
      [req.session.userId]
    );
    res.json(result.rows.map(row => row.course_id));
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.post('/api/progress', requireAuth, async (req, res) => {
  try {
    const { courseId, completed } = req.body;
    
    if (completed) {
      await pool.query(
        'INSERT INTO user_progress (user_id, course_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [req.session.userId, courseId]
      );
    } else {
      await pool.query(
        'DELETE FROM user_progress WHERE user_id = $1 AND course_id = $2',
        [req.session.userId, courseId]
      );
    }
    
    res.json({ success: true, courseId, completed });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});


app.listen(PORT, () => {
  console.log(`🎨 Art Roadmap API running on port ${PORT}`);
});
