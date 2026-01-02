const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  // Individual fallback variables
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  name: 'art_roadmap_session',
  secret: process.env.SESSION_SECRET || 'art-is-life-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'lax'
  }
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - User: ${req.user?.email || 'guest'}`);
  next();
});

// ==================== AUTH ROUTES ====================

// Signup
app.post('/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, username, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, username`,
      [firstName, lastName, email, username, passwordHash]
    );

    const user = result.rows[0];

    // Set session
    req.session.userId = user.id;
    req.session.email = user.email;

    // Set user info cookie (non-httpOnly)
    res.cookie('user_info', JSON.stringify({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      username: user.username
    }), {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: 'lax'
    });

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password required' });
    }

    // Find user by email or username
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [emailOrUsername]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Set session
    req.session.userId = user.id;
    req.session.email = user.email;

    // Set user info cookie
    res.cookie('user_info', JSON.stringify({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      username: user.username
    }), {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: 'lax'
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('art_roadmap_session');
    res.clearCookie('user_info');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Get current user
app.get('/auth/me', (req, res) => {
  if (req.session.userId) {
    pool.query(
      'SELECT id, first_name, last_name, email, username FROM users WHERE id = $1',
      [req.session.userId]
    ).then(result => {
      if (result.rows.length > 0) {
        const user = result.rows[0];
        res.json({
          authenticated: true,
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            username: user.username
          }
        });
      } else {
        res.json({ authenticated: false, user: null });
      }
    }).catch(() => {
      res.json({ authenticated: false, user: null });
    });
  } else {
    res.json({ authenticated: false, user: null });
  }
});

// ==================== MIDDLEWARE ====================

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const optionalAuth = (req, res, next) => {
  next();
};

// ==================== FORUM ROUTES ====================

app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/forum/posts', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        fp.id, fp.title, fp.content, fp.views, fp.created_at, fp.updated_at,
        u.username as author, u.id as author_id, u.first_name, u.last_name,
        c.name as category_name, c.icon as category_icon,
        COUNT(DISTINCT fr.id) as reply_count
      FROM forum_posts fp
      LEFT JOIN users u ON fp.user_id = u.id
      LEFT JOIN categories c ON fp.category_id = c.id
      LEFT JOIN forum_replies fr ON fp.id = fr.post_id
    `;

    const params = [];
    if (category && category !== 'all') {
      query += ' WHERE c.name = $1';
      params.push(category);
    }

    query += ' GROUP BY fp.id, u.username, u.id, u.first_name, u.last_name, c.name, c.icon';
    query += ' ORDER BY fp.created_at DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    let countQuery = 'SELECT COUNT(*) FROM forum_posts fp';
    const countParams = [];
    if (category && category !== 'all') {
      countQuery += ' LEFT JOIN categories c ON fp.category_id = c.id WHERE c.name = $1';
      countParams.push(category);
    }
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      posts: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        totalPages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/forum/posts/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('UPDATE forum_posts SET views = views + 1 WHERE id = $1', [id]);

    const postResult = await pool.query(
      `SELECT 
        fp.id, fp.title, fp.content, fp.views, fp.created_at, fp.updated_at,
        u.username as author, u.id as author_id, u.first_name, u.last_name,
        c.name as category_name, c.icon as category_icon
      FROM forum_posts fp
      LEFT JOIN users u ON fp.user_id = u.id
      LEFT JOIN categories c ON fp.category_id = c.id
      WHERE fp.id = $1`,
      [id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const repliesResult = await pool.query(
      `SELECT 
        fr.id, fr.content, fr.helpful_count, fr.created_at,
        u.username as author, u.id as author_id, u.first_name, u.last_name,
        CASE WHEN hm.id IS NOT NULL THEN true ELSE false END as marked_helpful_by_user
      FROM forum_replies fr
      LEFT JOIN users u ON fr.user_id = u.id
      LEFT JOIN helpful_marks hm ON fr.id = hm.reply_id AND hm.user_id = $2
      WHERE fr.post_id = $1
      ORDER BY fr.created_at ASC`,
      [id, req.session.userId || null]
    );

    res.json({
      post: postResult.rows[0],
      replies: repliesResult.rows
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

app.post('/api/forum/posts', requireAuth, async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }

    const result = await pool.query(
      `INSERT INTO forum_posts (user_id, category_id, title, content)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [req.session.userId, categoryId, title, content]
    );

    res.status(201).json({
      success: true,
      postId: result.rows[0].id,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.post('/api/forum/posts/:id/replies', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    const result = await pool.query(
      `INSERT INTO forum_replies (post_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING id`,
      [id, req.session.userId, content]
    );

    res.status(201).json({
      success: true,
      replyId: result.rows[0].id,
      message: 'Reply created successfully'
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

app.post('/api/forum/replies/:id/helpful', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const existingMark = await pool.query(
      'SELECT id FROM helpful_marks WHERE reply_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingMark.rows.length > 0) {
      await pool.query(
        'DELETE FROM helpful_marks WHERE reply_id = $1 AND user_id = $2',
        [id, userId]
      );
      await pool.query(
        'UPDATE forum_replies SET helpful_count = helpful_count - 1 WHERE id = $1',
        [id]
      );
      res.json({ success: true, action: 'removed' });
    } else {
      await pool.query(
        'INSERT INTO helpful_marks (reply_id, user_id) VALUES ($1, $2)',
        [id, userId]
      );
      await pool.query(
        'UPDATE forum_replies SET helpful_count = helpful_count + 1 WHERE id = $1',
        [id]
      );
      res.json({ success: true, action: 'added' });
    }
  } catch (error) {
    console.error('Error marking helpful:', error);
    res.status(500).json({ error: 'Failed to mark helpful' });
  }
});

// ==================== PROGRESS ROUTES ====================

app.get('/api/progress', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT course_id, completed, completed_at FROM user_progress WHERE user_id = $1',
      [req.session.userId]
    );
    res.json({ progress: result.rows });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.post('/api/progress', requireAuth, async (req, res) => {
  try {
    const { courseId, completed } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId required' });
    }

    await pool.query(
      `INSERT INTO user_progress (user_id, course_id, completed, completed_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, course_id)
       DO UPDATE SET completed = $3, completed_at = $4`,
      [req.session.userId, courseId, completed, completed ? new Date() : null]
    );

    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    authenticated: !!req.session.userId
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎨 Art Roadmap API running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
