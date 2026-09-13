const express = require('express');
const multer  = require('multer');
const path    = require('path');
const pool    = require('../db');
const { requireAuth, requireRole } = require('../middleware');

const router = express.Router();

// ── MULTER SETUP ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ok) cb(null, true);
    else cb(new Error('Images only (jpg, jpeg, png, webp).'));
  },
});

// ── SLA HELPER ────────────────────────────────────────────────────────────────
// Assign an SLA target in hours based on the sub_type of the report.
function getSla(subType) {
  const s = (subType || '').toLowerCase();
  if (s.includes('flush') || s.includes('tap') || s.includes('washroom')) return 12;
  if (s.includes('light') || s.includes('fan') || s.includes('electric') || s.includes('ac')) return 24;
  if (s.includes('bench') || s.includes('damage') || s.includes('railing') || s.includes('structural')) return 48;
  if (s.includes('garbage') || s.includes('campus') || s.includes('barrier') || s.includes('other')) return 72;
  return 48;  // default
}

// ── POST /api/reports ─────────────────────────────────────────────────────────
// Students submit a new report, optionally with a photo.
router.post('/', requireAuth, requireRole('student'), upload.single('photo'), async (req, res) => {
  const { block_id, location_type, room_number, landmark_name, floor_wing, report_type, sub_type, description } = req.body;

  if (!block_id || !location_type || !report_type || !description) {
    return res.status(400).json({ error: 'block_id, location_type, report_type, and description are required.' });
  }

  try {
    // 1. Find or create the location row
    let locResult = await pool.query(
      `SELECT id FROM locations
       WHERE block_id=$1 AND type=$2
         AND COALESCE(room_number,'') = $3
         AND COALESCE(landmark_name,'') = $4`,
      [block_id, location_type, room_number || '', landmark_name || '']
    );

    let location_id;
    if (locResult.rows.length) {
      location_id = locResult.rows[0].id;
    } else {
      const newLoc = await pool.query(
        `INSERT INTO locations (block_id, type, room_number, landmark_name, floor_wing)
         VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        [block_id, location_type, room_number || null, landmark_name || null, floor_wing || null]
      );
      location_id = newLoc.rows[0].id;
    }

    // 2. Duplicate check — same location + sub_type, not yet resolved/rejected
    const dup = await pool.query(
      `SELECT * FROM reports
       WHERE location_id=$1 AND sub_type=$2
         AND status NOT IN ('Resolved','Rejected')
       LIMIT 1`,
      [location_id, sub_type]
    );
    if (dup.rows.length) {
      return res.status(409).json({ duplicate: true, report: dup.rows[0] });
    }

    const sla_target_hours = getSla(sub_type);
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    // 3. Insert the report
    const reportResult = await pool.query(
      `INSERT INTO reports
         (student_id, location_id, report_type, sub_type, description, photo_url, sla_target_hours)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [req.session.user.id, location_id, report_type, sub_type, description, photo_url, sla_target_hours]
    );
    const report_id = reportResult.rows[0].id;

    // 4. Log initial status_history (null -> Open)
    await pool.query(
      `INSERT INTO status_history (report_id, old_status, new_status, changed_by)
       VALUES ($1, NULL, 'Open', $2)`,
      [report_id, req.session.user.id]
    );

    // 5. Notify the block's staff member
    const staffResult = await pool.query(
      `SELECT u.id FROM users u
       JOIN blocks b ON b.staff_id = u.id
       WHERE b.id=$1`,
      [block_id]
    );
    if (staffResult.rows.length) {
      const staff_id = staffResult.rows[0].id;
      await pool.query(
        `INSERT INTO notifications (user_id, title, subtitle, type, report_id)
         VALUES ($1, $2, $3, 'system', $4)`,
        [staff_id, 'New report in your block', `${sub_type || report_type}`, report_id]
      );
    }

    return res.json({ success: true, report_id });
  } catch (err) {
    console.error('Submit report error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/reports/:id/confirm ─────────────────────────────────────────────
// Another student confirms an existing report.
router.post('/:id/confirm', requireAuth, requireRole('student'), async (req, res) => {
  const report_id   = parseInt(req.params.id);
  const student_id  = req.session.user.id;

  try {
    // Insert confirmation (silently ignore self-confirm or duplicate)
    await pool.query(
      `INSERT INTO confirmations (report_id, student_id)
       VALUES ($1,$2)
       ON CONFLICT (report_id, student_id) DO NOTHING`,
      [report_id, student_id]
    );

    // Count all confirmations for this report
    const countRes = await pool.query(
      'SELECT COUNT(*) FROM confirmations WHERE report_id=$1',
      [report_id]
    );
    const count = parseInt(countRes.rows[0].count);

    // Notify the original reporter
    const reportRes = await pool.query('SELECT student_id FROM reports WHERE id=$1', [report_id]);
    if (reportRes.rows.length && reportRes.rows[0].student_id !== student_id) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, subtitle, type, report_id)
         VALUES ($1,$2,$3,'confirmation',$4)`,
        [
          reportRes.rows[0].student_id,
          `${count} other${count === 1 ? '' : 's'} confirmed your report`,
          `Report #${report_id}`,
          report_id,
        ]
      );
    }

    return res.json({ success: true, count });
  } catch (err) {
    console.error('Confirm error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/reports/my ───────────────────────────────────────────────────────
// Returns the logged-in student's reports with location, block, and confirmation count.
router.get('/my', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         r.*,
         l.type          AS location_type,
         l.room_number,
         l.landmark_name,
         l.floor_wing,
         b.name          AS block_name,
         COUNT(c.id)     AS confirmation_count
       FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       LEFT JOIN blocks    b ON b.id = l.block_id
       LEFT JOIN confirmations c ON c.report_id = r.id
       WHERE r.student_id = $1
       GROUP BY r.id, l.id, b.id
       ORDER BY r.created_at DESC`,
      [req.session.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('My reports error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/reports/:id ──────────────────────────────────────────────────────
// Full report detail. Students see their own; staff see their block; admin sees all.
router.get('/:id', requireAuth, async (req, res) => {
  const report_id = parseInt(req.params.id);
  const user = req.session.user;

  try {
    // Fetch full report with location, block, and confirmation count
    const result = await pool.query(
      `SELECT
         r.*,
         l.type          AS location_type,
         l.room_number,
         l.landmark_name,
         l.floor_wing,
         b.id            AS block_id_val,
         b.name          AS block_name,
         COUNT(c.id)     AS confirmation_count
       FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       LEFT JOIN blocks    b ON b.id = l.block_id
       LEFT JOIN confirmations c ON c.report_id = r.id
       WHERE r.id = $1
       GROUP BY r.id, l.id, b.id`,
      [report_id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Report not found.' });

    const report = result.rows[0];

    // Access control
    if (user.role === 'student' && report.student_id !== user.id) {
      return res.status(403).json({ error: 'Forbidden.' });
    }
    if (user.role === 'staff' && parseInt(report.block_id_val) !== parseInt(user.block_id)) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    // Attach status history
    const history = await pool.query(
      `SELECT sh.*, u.name AS changed_by_name
       FROM status_history sh
       LEFT JOIN users u ON u.id = sh.changed_by
       WHERE sh.report_id=$1
       ORDER BY sh.changed_at ASC`,
      [report_id]
    );
    report.status_history = history.rows;

    return res.json(report);
  } catch (err) {
    console.error('Report detail error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/reports/:id/cancel ─────────────────────────────────────────────
// Students cancel their own Open reports.
router.delete('/:id/cancel', requireAuth, requireRole('student'), async (req, res) => {
  const report_id = parseInt(req.params.id);
  const student_id = req.session.user.id;

  try {
    const check = await pool.query(
      `SELECT id, status, student_id FROM reports WHERE id=$1`,
      [report_id]
    );
    if (!check.rows.length) return res.status(404).json({ error: 'Report not found.' });

    const report = check.rows[0];
    if (report.student_id !== student_id) return res.status(403).json({ error: 'Forbidden.' });
    if (report.status !== 'Open') return res.status(400).json({ error: 'Only Open reports can be cancelled.' });

    await pool.query('DELETE FROM reports WHERE id=$1', [report_id]);
    return res.json({ success: true });
  } catch (err) {
    console.error('Cancel report error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/reports/:id/feedback ────────────────────────────────────────────
// Students leave a thumbs-up/down on their Resolved report.
router.post('/:id/feedback', requireAuth, requireRole('student'), async (req, res) => {
  const report_id  = parseInt(req.params.id);
  const student_id = req.session.user.id;
  const { rating, comment } = req.body;

  if (!rating || !['up', 'down'].includes(rating)) {
    return res.status(400).json({ error: 'rating must be "up" or "down".' });
  }

  try {
    // Verify the report is Resolved and belongs to this student
    const check = await pool.query(
      `SELECT id, status, student_id FROM reports WHERE id=$1`,
      [report_id]
    );
    if (!check.rows.length) return res.status(404).json({ error: 'Report not found.' });
    const report = check.rows[0];
    if (report.student_id !== student_id) return res.status(403).json({ error: 'Forbidden.' });
    if (report.status !== 'Resolved') return res.status(400).json({ error: 'Feedback only allowed on Resolved reports.' });

    await pool.query(
      `INSERT INTO feedback (report_id, student_id, rating, comment)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (report_id, student_id) DO NOTHING`,
      [report_id, student_id, rating, comment || null]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Feedback error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
