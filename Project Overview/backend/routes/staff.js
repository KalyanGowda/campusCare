const express = require('express');
const pool    = require('../db');
const { requireAuth, requireRole } = require('../middleware');

const router = express.Router();

// ── GET /api/staff/queue ──────────────────────────────────────────────────────
// All reports for the logged-in staff member's block, with SLA info.
router.get('/queue', requireAuth, requireRole('staff'), async (req, res) => {
  const { status, sort = 'newest' } = req.query;
  const block_id = req.session.user.block_id;
  const order    = sort === 'oldest' ? 'ASC' : 'DESC';

  try {
    // Build optional status filter
    const params = [block_id];
    let statusClause = '';
    if (status) {
      params.push(status);
      statusClause = `AND r.status = $${params.length}`;
    }

    // Each report gets hours_elapsed so we can compute SLA status in JS
    const result = await pool.query(
      `SELECT
         r.*,
         l.type         AS location_type,
         l.room_number,
         l.landmark_name,
         l.floor_wing,
         b.name         AS block_name,
         COUNT(c.id)    AS confirmation_count,
         EXTRACT(EPOCH FROM (NOW() - r.created_at)) / 3600 AS hours_elapsed
       FROM reports r
       LEFT JOIN locations l    ON l.id = r.location_id
       LEFT JOIN blocks    b    ON b.id = l.block_id
       LEFT JOIN confirmations c ON c.report_id = r.id
       WHERE l.block_id = $1
         ${statusClause}
       GROUP BY r.id, l.id, b.id
       ORDER BY r.created_at ${order}`,
      params
    );

    // Annotate each report with sla_status and hours_remaining
    const reports = result.rows.map((r) => {
      const elapsed   = parseFloat(r.hours_elapsed) || 0;
      const target    = r.sla_target_hours || 48;
      const remaining = target - elapsed;

      let sla_status;
      if (elapsed > target) {
        sla_status = 'overdue';
      } else if (remaining < target * 0.25) {
        sla_status = 'warning';
      } else {
        sla_status = 'ok';
      }

      return { ...r, sla_status, hours_remaining: remaining };
    });

    return res.json(reports);
  } catch (err) {
    console.error('Staff queue error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/staff/reports/:id/status ───────────────────────────────────────
// Move a report through the allowed progression.
router.patch('/reports/:id/status', requireAuth, requireRole('staff'), async (req, res) => {
  const report_id  = parseInt(req.params.id);
  const { new_status } = req.body;
  const staff      = req.session.user;

  // Only these transitions are valid
  const allowed = {
    'Open':         'Acknowledged',
    'Acknowledged': 'In Progress',
    'In Progress':  'Resolved',
  };

  try {
    const reportRes = await pool.query(
      `SELECT r.*, l.block_id FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       WHERE r.id=$1`,
      [report_id]
    );
    if (!reportRes.rows.length) return res.status(404).json({ error: 'Report not found.' });

    const report = reportRes.rows[0];

    // Staff can only act on their own block's reports
    if (parseInt(report.block_id) !== parseInt(staff.block_id)) return res.status(403).json({ error: 'Forbidden.' });

    // Validate transition
    if (allowed[report.status] !== new_status) {
      return res.status(400).json({
        error: `Cannot move from ${report.status} to ${new_status}. Allowed: ${report.status} → ${allowed[report.status] || 'none'}.`,
      });
    }

    // Update the report
    const resolvedAt = new_status === 'Resolved' ? 'NOW()' : 'resolved_at';
    await pool.query(
      `UPDATE reports SET status=$1, resolved_at=${resolvedAt === 'NOW()' ? 'NOW()' : 'resolved_at'} WHERE id=$2`,
      [new_status, report_id]
    );
    if (new_status === 'Resolved') {
      await pool.query('UPDATE reports SET resolved_at=NOW() WHERE id=$1', [report_id]);
    }

    // Log status history
    await pool.query(
      `INSERT INTO status_history (report_id, old_status, new_status, changed_by)
       VALUES ($1,$2,$3,$4)`,
      [report_id, report.status, new_status, staff.id]
    );

    // Notify the student
    const typeMap = { 'Resolved': 'resolved', 'In Progress': 'status_change', 'Acknowledged': 'status_change' };
    await pool.query(
      `INSERT INTO notifications (user_id, title, subtitle, type, report_id)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        report.student_id,
        new_status === 'Resolved' ? 'Your report has been resolved' : `Your report status updated to ${new_status}`,
        report.sub_type || report.report_type,
        typeMap[new_status] || 'status_change',
        report_id,
      ]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Status update error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── PATCH /api/staff/reports/:id/reject ───────────────────────────────────────
// Staff rejects a report with a mandatory reason.
router.patch('/reports/:id/reject', requireAuth, requireRole('staff'), async (req, res) => {
  const report_id = parseInt(req.params.id);
  const { rejection_reason } = req.body;
  const staff = req.session.user;

  if (!rejection_reason || !rejection_reason.trim()) {
    return res.status(400).json({ error: 'rejection_reason is required.' });
  }

  try {
    const reportRes = await pool.query(
      `SELECT r.*, l.block_id FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       WHERE r.id=$1`,
      [report_id]
    );
    if (!reportRes.rows.length) return res.status(404).json({ error: 'Report not found.' });

    const report = reportRes.rows[0];
    if (parseInt(report.block_id) !== parseInt(staff.block_id)) return res.status(403).json({ error: 'Forbidden.' });

    await pool.query(
      `UPDATE reports SET status='Rejected', rejection_reason=$1 WHERE id=$2`,
      [rejection_reason.trim(), report_id]
    );

    await pool.query(
      `INSERT INTO status_history (report_id, old_status, new_status, changed_by)
       VALUES ($1,$2,'Rejected',$3)`,
      [report_id, report.status, staff.id]
    );

    // Notify student — include reason in subtitle
    await pool.query(
      `INSERT INTO notifications (user_id, title, subtitle, type, report_id)
       VALUES ($1,$2,$3,'rejected',$4)`,
      [
        report.student_id,
        'Your report was marked as invalid',
        `Reason: ${rejection_reason.trim()}`,
        report_id,
      ]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Reject error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ── GET /api/staff/block-rating ───────────────────────────────────────────────
// Performance rating for the staff member's own block this calendar month.
router.get('/block-rating', requireAuth, requireRole('staff'), async (req, res) => {
  const block_id = req.session.user.block_id;

  try {
    // All this-month reports in the block (excluding Rejected from resolution math)
    const result = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status != 'Rejected') AS total,
         COUNT(*) FILTER (WHERE status = 'Resolved')  AS resolved,
         COUNT(*) FILTER (WHERE status = 'Rejected')  AS rejected,

         -- Timeliness: ratio of SLA used (capped at 1.0 = resolved on time)
         AVG(
           LEAST(
             sla_target_hours::float /
               NULLIF(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600, 0),
             1.0
           )
         ) FILTER (WHERE status = 'Resolved') AS timeliness_score,

         -- Overdue: still open and past SLA
         COUNT(*) FILTER (
           WHERE status IN ('Open','Acknowledged')
             AND EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 > sla_target_hours
         ) AS overdue_count

       FROM reports r
       LEFT JOIN locations l ON l.id = r.location_id
       WHERE l.block_id = $1
         AND EXTRACT(MONTH FROM r.created_at) = EXTRACT(MONTH FROM NOW())
         AND EXTRACT(YEAR  FROM r.created_at) = EXTRACT(YEAR  FROM NOW())`,
      [block_id]
    );

    const row = result.rows[0];
    const total       = parseInt(row.total)    || 0;
    const resolved    = parseInt(row.resolved) || 0;
    const rejected    = parseInt(row.rejected) || 0;
    const overdue     = parseInt(row.overdue_count) || 0;
    const timeliness  = parseFloat(row.timeliness_score) || 0;

    const resolution_rate = total > 0 ? resolved / total : 0;
    const final_rating    = (0.5 * resolution_rate + 0.5 * timeliness) * 100;

    return res.json({
      total,
      resolved,
      rejected,
      overdue_count:      overdue,
      resolution_rate:    parseFloat(resolution_rate.toFixed(4)),
      timeliness_score:   parseFloat(timeliness.toFixed(4)),
      final_rating:       parseFloat(final_rating.toFixed(2)),
    });
  } catch (err) {
    console.error('Block rating error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
