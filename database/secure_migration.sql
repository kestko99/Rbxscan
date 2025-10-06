-- Secure Password Migration Script
-- This script helps migrate from MD5 to bcrypt hashing

-- Step 1: Add new columns for bcrypt
ALTER TABLE `uc_user` 
ADD COLUMN `password_bcrypt` VARCHAR(255) NULL AFTER `password`,
ADD COLUMN `needs_password_reset` TINYINT(1) DEFAULT 1 AFTER `password_bcrypt`;

-- Step 2: Mark all existing users as needing password reset
UPDATE `uc_user` SET `needs_password_reset` = 1 WHERE 1=1;

-- Step 3: Create password reset tokens table
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` INT(11) NOT NULL,
    `used` TINYINT(1) DEFAULT 0,
    `created_at` INT(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `token` (`token`),
    KEY `user_id` (`user_id`),
    KEY `expires_at` (`expires_at`),
    FOREIGN KEY (`user_id`) REFERENCES `uc_user`(`uc_user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 4: Migration plan (to be implemented in backend code)
/*
Backend Implementation Steps:

1. Generate password reset tokens for all users:
   INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at) 
   SELECT uc_user_id, SHA2(CONCAT(email, UNIX_TIMESTAMP(), RAND()), 256), 
          UNIX_TIMESTAMP() + 86400*7, UNIX_TIMESTAMP() 
   FROM uc_user WHERE needs_password_reset = 1;

2. Send password reset emails to all users

3. When user resets password, use bcrypt:
   - Hash new password with bcrypt
   - Store in password_bcrypt column
   - Set needs_password_reset = 0
   - Clear old MD5 password

4. Update login logic to check bcrypt first, fall back to MD5 temporarily

5. After migration period, remove MD5 columns:
   ALTER TABLE uc_user DROP COLUMN password, DROP COLUMN salt;
   ALTER TABLE uc_user CHANGE password_bcrypt password VARCHAR(255) NOT NULL;
*/

-- Step 5: Cleanup after migration (run after all users have reset passwords)
-- ALTER TABLE `uc_user` DROP COLUMN `password_old`;
-- ALTER TABLE `uc_user` DROP COLUMN `salt`;
-- ALTER TABLE `uc_user` DROP COLUMN `needs_password_reset`;
-- DROP TABLE `password_reset_tokens`;