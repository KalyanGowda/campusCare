require('dotenv').config();
const pool = require('./db');

// Clears all report-related data from the database,
// leaving only blocks and users intact.
async function reset() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete in dependency order to avoid FK violations
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM feedback');
    await client.query('DELETE FROM confirmations');
    await client.query('DELETE FROM status_history');
    await client.query('DELETE FROM reports');
    await client.query('DELETE FROM locations');

    await client.query('COMMIT');
    console.log('✅  All report data cleared. Users and blocks untouched.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Reset failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
