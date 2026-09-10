require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const pool = require('./db');

async function runSchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('✅  All 8 tables created (or already exist).');
  } catch (err) {
    console.error('❌  Schema error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runSchema();
