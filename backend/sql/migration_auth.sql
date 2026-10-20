-- Migration Script: Add Authentication and User Ownership to Daily DSA Mistake Log
USE dsa_mistake_log;

-- 1. Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Insert initial system/demo user if not exists (password hash for: SystemUser@2026)
INSERT INTO users (name, email, password, role, created_at, updated_at)
SELECT 'System User', 'system@dsamistakelog.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'USER', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'system@dsamistakelog.com');

-- 3. Add user_id column to mistakes if it does not exist
SET @col_exists = (
    SELECT COUNT(*) 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = 'dsa_mistake_log' 
      AND TABLE_NAME = 'mistakes' 
      AND COLUMN_NAME = 'user_id'
);

SET @add_col_sql = IF(@col_exists = 0, 'ALTER TABLE mistakes ADD COLUMN user_id BIGINT NULL', 'SELECT "Column user_id already exists"');
PREPARE stmt FROM @add_col_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Safely assign any existing unowned mistakes to the system user
UPDATE mistakes 
SET user_id = (SELECT id FROM users WHERE email = 'system@dsamistakelog.com' LIMIT 1)
WHERE user_id IS NULL;

-- 5. Modify user_id to NOT NULL and add foreign key constraint if missing
ALTER TABLE mistakes MODIFY COLUMN user_id BIGINT NOT NULL;

SET @fk_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = 'dsa_mistake_log' 
      AND TABLE_NAME = 'mistakes' 
      AND CONSTRAINT_NAME = 'fk_mistakes_user'
);

SET @add_fk_sql = IF(@fk_exists = 0, 'ALTER TABLE mistakes ADD CONSTRAINT fk_mistakes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE', 'SELECT "FK fk_mistakes_user already exists"');
PREPARE stmt_fk FROM @add_fk_sql;
EXECUTE stmt_fk;
DEALLOCATE PREPARE stmt_fk;

-- 6. Add index on user_id if missing
SET @idx_exists = (
    SELECT COUNT(*) 
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = 'dsa_mistake_log' 
      AND TABLE_NAME = 'mistakes' 
      AND INDEX_NAME = 'idx_mistake_user_id'
);

SET @add_idx_sql = IF(@idx_exists = 0, 'CREATE INDEX idx_mistake_user_id ON mistakes (user_id)', 'SELECT "Index idx_mistake_user_id already exists"');
PREPARE stmt_idx FROM @add_idx_sql;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;
