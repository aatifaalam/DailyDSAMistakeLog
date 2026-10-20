-- Daily DSA Mistake Log Schema
-- Database: dsa_mistake_log

CREATE DATABASE IF NOT EXISTS dsa_mistake_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dsa_mistake_log;

-- Users table
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

-- Mistakes table
CREATE TABLE IF NOT EXISTS mistakes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    problem_name VARCHAR(255) NOT NULL,
    platform VARCHAR(50),
    problem_url VARCHAR(1000),
    topic VARCHAR(100),
    first_approach TEXT NOT NULL,
    why_wrong TEXT NOT NULL,
    mistake_type VARCHAR(50) NOT NULL,
    correct_approach TEXT,
    what_to_change_next_time TEXT NOT NULL,
    time_complexity VARCHAR(50),
    space_complexity VARCHAR(50),
    solved_independently BOOLEAN NOT NULL DEFAULT FALSE,
    review_status VARCHAR(50) NOT NULL DEFAULT 'NOT_REVIEWED',
    review_date DATE,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_mistakes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_mistake_user_id (user_id),
    INDEX idx_mistake_topic (topic),
    INDEX idx_mistake_type (mistake_type),
    INDEX idx_mistake_platform (platform),
    INDEX idx_mistake_review_status (review_status),
    INDEX idx_mistake_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
