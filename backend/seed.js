require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── BLOCKS ────────────────────────────────────────────────────────────────
    console.log('Seeding blocks...');
    const blockNames = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Campus'];
    const blockIds = {};
    for (const name of blockNames) {
      const res = await client.query(
        'INSERT INTO blocks (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id',
        [name]
      );
      if (res.rows.length) {
        blockIds[name] = res.rows[0].id;
      } else {
        const existing = await client.query('SELECT id FROM blocks WHERE name=$1', [name]);
        blockIds[name] = existing.rows[0].id;
      }
    }

    // ── USERS ─────────────────────────────────────────────────────────────────
    console.log('Seeding users...');
    const SALT = 10;

    // Admin
    const adminHash = await bcrypt.hash('admin123', SALT);
    await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1,$2,$3,'admin')
       ON CONFLICT (email) DO UPDATE SET password=EXCLUDED.password`,
      ['Admin User', 'admin@bmsit.in', adminHash]
    );

    // Staff — one per block (A–F)
    const staffData = [
      { name: 'Meena S',    email: 'meena.s@bmsit.in',   block: 'Block A' },
      { name: 'Ravi Kumar', email: 'ravi.kumar@bmsit.in', block: 'Block B' },
      { name: 'Suresh R',   email: 'suresh.r@bmsit.in',  block: 'Block C' },
      { name: 'Anita P',    email: 'anita.p@bmsit.in',   block: 'Block D' },
      { name: 'Kiran M',    email: 'kiran.m@bmsit.in',   block: 'Block E' },
      { name: 'Deepa N',    email: 'deepa.n@bmsit.in',   block: 'Block F' },
    ];
    const staffHash = await bcrypt.hash('staff123', SALT);
    for (const s of staffData) {
      const res = await client.query(
        `INSERT INTO users (name, email, password, role, block_id)
         VALUES ($1,$2,$3,'staff',$4)
         ON CONFLICT (email) DO UPDATE SET password=EXCLUDED.password
         RETURNING id`,
        [s.name, s.email, staffHash, blockIds[s.block]]
      );
      const staffId = res.rows[0].id;
      // Link block -> staff
      await client.query('UPDATE blocks SET staff_id=$1 WHERE id=$2', [staffId, blockIds[s.block]]);
    }

    // Students
    const studentHash = await bcrypt.hash('student123', SALT);
    await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1,$2,$3,'student')
       ON CONFLICT (email) DO UPDATE SET password=EXCLUDED.password`,
      ['Arjun Kumar', 'arjun.kumar@bmsit.in', studentHash]
    );
    await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1,$2,$3,'student')
       ON CONFLICT (email) DO UPDATE SET password=EXCLUDED.password`,
      ['Priya S', 'priya.s@bmsit.in', studentHash]
    );

    await client.query('COMMIT');
    console.log('\n✅  Seed complete — login credentials:\n');
    console.log('  Role    Email                      Password');
    console.log('  ──────  ─────────────────────────  ───────────');
    console.log('  admin   admin@bmsit.in             admin123');
    console.log('  staff   meena.s@bmsit.in           staff123   (Block A)');
    console.log('  staff   ravi.kumar@bmsit.in        staff123   (Block B)');
    console.log('  staff   suresh.r@bmsit.in          staff123   (Block C)');
    console.log('  staff   anita.p@bmsit.in           staff123   (Block D)');
    console.log('  staff   kiran.m@bmsit.in           staff123   (Block E)');
    console.log('  staff   deepa.n@bmsit.in           staff123   (Block F)');
    console.log('  student arjun.kumar@bmsit.in       student123');
    console.log('  student priya.s@bmsit.in           student123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
