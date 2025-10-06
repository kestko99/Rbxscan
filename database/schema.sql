-- Database Schema for RbxScan User Management
-- This file defines the table structure for user data

-- Create database (optional - uncomment if needed)
-- CREATE DATABASE rbxscan_db;
-- USE rbxscan_db;

-- User table structure
CREATE TABLE IF NOT EXISTS `uc_user` (
    `uc_user_id` INT(11) NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `nick_name` VARCHAR(100) DEFAULT '',
    `password` VARCHAR(32) NOT NULL COMMENT 'MD5 hashed password',
    `salt` VARCHAR(6) NOT NULL COMMENT 'Password salt',
    `reg_ip` VARCHAR(45) DEFAULT '' COMMENT 'Registration IP address',
    `create_time` INT(11) NOT NULL COMMENT 'Unix timestamp of creation',
    `update_time` INT(11) NOT NULL COMMENT 'Unix timestamp of last update',
    `email_status` TINYINT(1) DEFAULT 0 COMMENT '0=unverified, 1=verified',
    `status` TINYINT(1) DEFAULT 1 COMMENT '0=inactive, 1=active',
    PRIMARY KEY (`uc_user_id`),
    UNIQUE KEY `email` (`email`),
    KEY `idx_email_status` (`email_status`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Additional indexes for performance
CREATE INDEX `idx_email_verified` ON `uc_user` (`email`, `email_status`);
CREATE INDEX `idx_active_users` ON `uc_user` (`status`, `create_time`);