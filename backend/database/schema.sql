CREATE TABLE IF NOT EXISTS students (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE students
ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100);

ALTER TABLE students
ADD COLUMN IF NOT EXISTS department VARCHAR(100) NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS teachers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'staff'
        CHECK (role IN ('super_admin', 'staff', 'viewer')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE admins
ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'staff';

-- Keep role values consistent on databases created by earlier app versions.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'admins_role_allowed'
          AND conrelid = 'admins'::regclass
    ) THEN
        ALTER TABLE admins
        ADD CONSTRAINT admins_role_allowed
        CHECK (role IN ('super_admin', 'staff', 'viewer'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS students_class_name_idx ON students (class_name);
CREATE INDEX IF NOT EXISTS teachers_department_idx ON teachers (department);
CREATE INDEX IF NOT EXISTS admins_role_idx ON admins (role);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email
ON password_reset_tokens (email);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expiry
ON password_reset_tokens (expires_at);