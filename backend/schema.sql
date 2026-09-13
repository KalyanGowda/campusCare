-- CARE Database Schema
-- Run with: node runSchema.js

-- TABLE 1: users
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  NOT NULL CHECK (role IN ('student', 'staff', 'admin')),
  block_id   INTEGER,                        -- only set for staff
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE 2: blocks
CREATE TABLE IF NOT EXISTS blocks (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(50) NOT NULL,
  staff_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Add FK from users.block_id -> blocks after both tables exist.
-- Wrapped in a DO block so re-running the schema is safe (duplicate constraint is ignored).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_users_block'
      AND table_name = 'users'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_block
      FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE SET NULL;
  END IF;
END
$$;

-- TABLE 3: locations
CREATE TABLE IF NOT EXISTS locations (
  id             SERIAL PRIMARY KEY,
  block_id       INTEGER REFERENCES blocks(id) ON DELETE SET NULL,
  type           VARCHAR(30) NOT NULL CHECK (type IN ('classroom', 'lab', 'washroom', 'others', 'campus_landmark')),
  room_number    VARCHAR(20),
  landmark_name  VARCHAR(100),
  floor_wing     VARCHAR(50)
);

-- TABLE 4: reports
CREATE TABLE IF NOT EXISTS reports (
  id               SERIAL PRIMARY KEY,
  student_id       INTEGER REFERENCES users(id),
  location_id      INTEGER REFERENCES locations(id),
  report_type      VARCHAR(20)  NOT NULL CHECK (report_type IN ('issue', 'damage', 'other')),
  sub_type         VARCHAR(100),
  description      TEXT NOT NULL,
  photo_url        VARCHAR(255),
  status           VARCHAR(20)  DEFAULT 'Open' CHECK (status IN ('Open', 'Acknowledged', 'In Progress', 'Resolved', 'Rejected')),
  rejection_reason TEXT,
  sla_target_hours INTEGER DEFAULT 48,
  created_at       TIMESTAMP DEFAULT NOW(),
  resolved_at      TIMESTAMP
);

-- TABLE 5: confirmations
CREATE TABLE IF NOT EXISTS confirmations (
  id           SERIAL PRIMARY KEY,
  report_id    INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  student_id   INTEGER REFERENCES users(id),
  confirmed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (report_id, student_id)
);

-- TABLE 6: status_history
CREATE TABLE IF NOT EXISTS status_history (
  id         SERIAL PRIMARY KEY,
  report_id  INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by INTEGER REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW()
);

-- TABLE 7: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(150) NOT NULL,
  subtitle   VARCHAR(255),
  type       VARCHAR(30) CHECK (type IN ('status_change', 'confirmation', 'resolved', 'rejected', 'system')),
  is_read    BOOLEAN DEFAULT FALSE,
  report_id  INTEGER REFERENCES reports(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TABLE 8: feedback
CREATE TABLE IF NOT EXISTS feedback (
  id           SERIAL PRIMARY KEY,
  report_id    INTEGER REFERENCES reports(id) ON DELETE CASCADE,
  student_id   INTEGER REFERENCES users(id),
  rating       VARCHAR(10) CHECK (rating IN ('up', 'down')),
  comment      TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (report_id, student_id)
);
