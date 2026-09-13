const express = require('express');
const bcrypt  = require('bcryptjs');
const pool    = require('../db');
const { requireAuth } = require('../middleware');

const router = express.Router();

// ── POST /api/auth/register ───────────────────────────────────────────────────
// Only creates student accounts. Email must end with @<COLLEGE_EMAIL_DOMAIN>.
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required.' });
  }

  const domain = process.env.COLLEGE_EMAIL_DOMAIN || 'bmsit.in';
  if (!email.endsWith(`@${domain}`)) {
    return res.status(400).json({ error: `Email must end with @${domain}.` });
  }

  try {
    // Check for duplicate email
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ error: 'An account with that email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,'student')`,
      [name, email, hashed]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user   = result.rows[0];

    // Use a generic message to avoid leaking which field was wrong
    const genericError = "That email and password don't match.";

    if (!user) return res.status(401).json({ error: genericError });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: genericError });

    // Store minimal info in session (no password)
    req.session.user = {
      id:       user.id,
      name:     user.name,
      email:    user.email,
      role:     user.role,
      block_id: user.block_id,
    };

    return res.json({ success: true, role: user.role, name: user.name });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  return res.json(req.session.user);
});

module.exports = router;
