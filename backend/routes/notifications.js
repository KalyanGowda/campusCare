const express = require('express');
const pool    = require('../db');
const { requireAuth } = require('../middleware');

const router = express.Router();

// ── GET /api/notifications ────────────────────────────────────────────────────
// All notifications for the logged-in user, plus an unread count.
router.get('/', requireAuth, async (req, res) => {
  const user_id = req.session.user.id;
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [user_id]
    );

    const unread_count = result.rows.filter((n) => !n.is_read).length;
    return res.json({ notifications: result.rows, unread_count });
  } catch (err) {
    console.error('Notifications error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/notifications/read-all ─────────────────────────────────────────
// Mark all of the user's notifications as read.
router.patch('/read-all', requireAuth, async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read=TRUE WHERE user_id=$1`,
      [req.session.user.id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('Read all error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/notifications/:id/read ─────────────────────────────────────────
// Mark a single notification as read (only if it belongs to the current user).
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read=TRUE
       WHERE id=$1 AND user_id=$2`,
      [parseInt(req.params.id), req.session.user.id]
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('Read one error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
