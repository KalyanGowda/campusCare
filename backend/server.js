require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// credentials:true is critical — without it the session cookie won't be sent.
// Allow both the Figma Make dev port (8443) and the standard Vite port (5173).
const corsOptions = {
  origin: ['http://localhost:8443', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions));   // handle preflight for every route (Express 5 syntax)

// ── BODY PARSING ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── SESSION ───────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 86400000,   // 1 day in ms
  },
}));

// ── STATIC UPLOADS ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));

// Public: list of blocks (needed by the report form for all roles)
app.get('/api/blocks', async (req, res) => {
  const pool = require('./db');
  try {
    // DISTINCT ON name keeps the lowest id per name, avoiding duplicate blocks
    // from multiple seed runs.
    const result = await pool.query(
      'SELECT DISTINCT ON (name) id, name FROM blocks ORDER BY name, id'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── START ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅  CARE backend running on http://localhost:${PORT}`);
});

// Re-export middleware so any file that already imports from './server' still works.
module.exports = require('./middleware');
