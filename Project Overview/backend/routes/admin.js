const express = require('express');
const bcrypt  = require('bcryptjs');
const pool    = require('../db');
const { requireAuth, requireRole } = require('../middleware');

const router = express.Router();

// ── GET /api/admin/reports ────────────────────────────────────────────────────
// All reports, paginated (10/page), with optional filters.
router.get('/reports', requireAuth, requireRole('admin'), async (req, res) => {
  const { block, status, category, page = 1 } = req.query;
  const limit  = 10;
  const offset = (parseInt(page) - 1) * limit;

  try {
    const params  = [];
    const clauses = [];

    if (block) {
      params.push(block);
      clauses.push(`b.name = $${params.length}`);
    }
    if (status) {
      params.push(status);
      clauses.push(`r.status = $${params.length}`);
    }
    if (category) {
      params.push(`%${category}%`);
      clauses.push(`r.sub_type ILIKE $${params.length}`);
    }

    const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';

    // Count for pagination
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       LEFT JOIN blocks    b ON b.id = l.block_id
       ${where}`,
      params
    );
    const total = parseInt(countRes.rows[0].count);

    // Paginated report list with reporter and staff names
    params.push(limit, offset);
    const result = await pool.query(
      `SELECT
         r.*,
         l.type         AS location_type,
         l.room_number,
         l.landmark_name,
         b.name         AS block_name,
         reporter.name  AS reporter_name,
         staff.name     AS staff_name
       FROM reports r
       LEFT JOIN locations l    ON l.id = r.location_id
       LEFT JOIN blocks    b    ON b.id = l.block_id
       LEFT JOIN users reporter ON reporter.id = r.student_id
       LEFT JOIN users staff    ON staff.id = b.staff_id
       ${where}
       ORDER BY r.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return res.json({
      reports: result.rows,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Admin reports error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/admin/block-ratings ──────────────────────────────────────────────
// Same rating formula as staff/block-rating but for ALL blocks in one query.
router.get('/block-ratings', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         b.id            AS block_id,
         b.name          AS block_name,
         u.name          AS staff_name,

         COUNT(r.id) FILTER (WHERE r.status != 'Rejected') AS total,
         COUNT(r.id) FILTER (WHERE r.status = 'Resolved')  AS resolved,
         COUNT(r.id) FILTER (WHERE r.status = 'Rejected')  AS rejected,

         AVG(
           LEAST(
             r.sla_target_hours::float /
               NULLIF(EXTRACT(EPOCH FROM (r.resolved_at - r.created_at)) / 3600, 0),
             1.0
           )
         ) FILTER (WHERE r.status = 'Resolved') AS timeliness_score,

         COUNT(r.id) FILTER (
           WHERE r.status IN ('Open','Acknowledged')
             AND EXTRACT(EPOCH FROM (NOW() - r.created_at)) / 3600 > r.sla_target_hours
         ) AS overdue_count

       FROM blocks b
       LEFT JOIN users     u ON u.id = b.staff_id
       LEFT JOIN locations l ON l.block_id = b.id
       LEFT JOIN reports   r ON r.location_id = l.id
         AND EXTRACT(MONTH FROM r.created_at) = EXTRACT(MONTH FROM NOW())
         AND EXTRACT(YEAR  FROM r.created_at) = EXTRACT(YEAR  FROM NOW())
       GROUP BY b.id, b.name, u.name
       ORDER BY b.name`
    );

    const ratings = result.rows.map((row) => {
      const total      = parseInt(row.total)    || 0;
      const resolved   = parseInt(row.resolved) || 0;
      const timeliness = parseFloat(row.timeliness_score) || 0;
      const resolution_rate = total > 0 ? resolved / total : 0;
      const final_rating    = (0.5 * resolution_rate + 0.5 * timeliness) * 100;

      return {
        block_id:        row.block_id,
        block_name:      row.block_name,
        staff_name:      row.staff_name || '(unassigned)',
        total_reports:   total,
        resolved:        resolved,
        rejected:        parseInt(row.rejected)      || 0,
        overdue_count:   parseInt(row.overdue_count) || 0,
        resolution_rate: parseFloat(resolution_rate.toFixed(4)),
        timeliness_score: parseFloat(timeliness.toFixed(4)),
        final_rating:    parseFloat(final_rating.toFixed(2)),
      };
    });

    return res.json(ratings.sort((a, b) => b.final_rating - a.final_rating));
  } catch (err) {
    console.error('Block ratings error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/admin/staff ──────────────────────────────────────────────────────
// All staff accounts with their block and handled report count.
router.get('/staff', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id, u.name, u.email, u.created_at,
         b.id   AS block_id,
         b.name AS block_name,
         COUNT(r.id) AS reports_handled
       FROM users u
       LEFT JOIN blocks    b ON b.id = u.block_id
       LEFT JOIN locations l ON l.block_id = b.id
       LEFT JOIN reports   r ON r.location_id = l.id
         AND r.status = 'Resolved'
       WHERE u.role = 'staff'
       GROUP BY u.id, b.id, b.name
       ORDER BY u.name`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Admin staff list error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── POST /api/admin/staff ─────────────────────────────────────────────────────
// Create a new staff account and link them to a block.
router.post('/staff', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, email, password, block_id } = req.body;

  if (!name || !email || !password || !block_id) {
    return res.status(400).json({ error: 'name, email, password, and block_id are required.' });
  }

  const domain = process.env.COLLEGE_EMAIL_DOMAIN || 'bmsit.in';
  if (!email.endsWith(`@${domain}`)) {
    return res.status(400).json({ error: `Email must end with @${domain}.` });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length) {
      return res.status(400).json({ error: 'An account with that email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role, block_id)
       VALUES ($1,$2,$3,'staff',$4) RETURNING id`,
      [name, email, hashed, parseInt(block_id)]
    );
    const new_id = newUser.rows[0].id;

    // Assign them to the block
    await pool.query('UPDATE blocks SET staff_id=$1 WHERE id=$2', [new_id, parseInt(block_id)]);

    return res.json({ success: true });
  } catch (err) {
    console.error('Create staff error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── DELETE /api/admin/staff/:id ───────────────────────────────────────────────
// Remove a staff account and unlink them from their block.
router.delete('/staff/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const staff_id = parseInt(req.params.id);

  try {
    await pool.query('UPDATE blocks SET staff_id=NULL WHERE staff_id=$1', [staff_id]);
    await pool.query('DELETE FROM users WHERE id=$1 AND role=\'staff\'', [staff_id]);
    return res.json({ success: true });
  } catch (err) {
    console.error('Delete staff error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/admin/analytics ──────────────────────────────────────────────────
// Aggregated chart data for the current calendar month.
router.get('/analytics', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const monthFilter = `
      AND EXTRACT(MONTH FROM r.created_at) = EXTRACT(MONTH FROM NOW())
      AND EXTRACT(YEAR  FROM r.created_at) = EXTRACT(YEAR  FROM NOW())
    `;

    // Counts by block
    const byBlock = await pool.query(
      `SELECT b.name AS block_name, COUNT(r.id) AS count
       FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       LEFT JOIN blocks    b ON b.id = l.block_id
       WHERE TRUE ${monthFilter}
       GROUP BY b.name ORDER BY count DESC`
    );

    // Counts by sub_type (category)
    const byCategory = await pool.query(
      `SELECT sub_type, COUNT(*) AS count
       FROM reports r
       WHERE TRUE ${monthFilter}
       GROUP BY sub_type ORDER BY count DESC LIMIT 10`
    );

    // Counts by status
    const byStatus = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM reports r
       WHERE TRUE ${monthFilter}
       GROUP BY status`
    );

    // Totals
    const totals = await pool.query(
      `SELECT
         COUNT(*)                                                      AS total_this_month,
         AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600)
           FILTER (WHERE status='Resolved' AND resolved_at IS NOT NULL) AS avg_resolution_hours,
         COUNT(*) FILTER (
           WHERE status IN ('Open','Acknowledged')
             AND EXTRACT(EPOCH FROM (NOW()-created_at))/3600 > sla_target_hours
         ) AS escalated_count
       FROM reports r
       WHERE TRUE ${monthFilter}`
    );

    // Flatten status counts into an object
    const statusCounts = { open: 0, acknowledged: 0, in_progress: 0, resolved: 0, rejected: 0 };
    for (const row of byStatus.rows) {
      const key = row.status.toLowerCase().replace(' ', '_');
      statusCounts[key] = parseInt(row.count);
    }

    const t = totals.rows[0];
    return res.json({
      by_block:            byBlock.rows.map((r) => ({ block_name: r.block_name, count: parseInt(r.count) })),
      by_category:         byCategory.rows.map((r) => ({ sub_type: r.sub_type, count: parseInt(r.count) })),
      by_status:           statusCounts,
      total_this_month:    parseInt(t.total_this_month) || 0,
      avg_resolution_hours: parseFloat(t.avg_resolution_hours) || 0,
      escalated_count:     parseInt(t.escalated_count) || 0,
    });
  } catch (err) {
    console.error('Analytics error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/admin/escalated ──────────────────────────────────────────────────
// Reports past their SLA target that are still open.
router.get('/escalated', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         r.*,
         l.type         AS location_type,
         l.room_number,
         l.landmark_name,
         b.name         AS block_name,
         EXTRACT(EPOCH FROM (NOW() - r.created_at)) / 3600 - r.sla_target_hours AS hours_overdue
       FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       LEFT JOIN blocks    b ON b.id = l.block_id
       WHERE r.status IN ('Open','Acknowledged')
         AND EXTRACT(EPOCH FROM (NOW() - r.created_at)) / 3600 > r.sla_target_hours
       ORDER BY hours_overdue DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Escalated error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
