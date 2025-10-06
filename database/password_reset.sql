-- Password Reset Script for Development
-- This script resets all user passwords to a known development password
-- WARNING: Only use this in development environments!

-- Option 1: Reset to simple password for development (NOT SECURE)
-- Password: "dev123" with MD5 hash
UPDATE `uc_user` SET 
    `password` = MD5(CONCAT('dev123', `salt`)),
    `update_time` = UNIX_TIMESTAMP()
WHERE `status` = 1;

-- Option 2: Reset to stronger password for development
-- Password: "DevPassword2024!" with MD5 hash
-- UPDATE `uc_user` SET 
--     `password` = MD5(CONCAT('DevPassword2024!', `salt`)),
--     `update_time` = UNIX_TIMESTAMP()
-- WHERE `status` = 1;

-- Option 3: Individual user resets (uncomment as needed)
-- UPDATE `uc_user` SET `password` = MD5(CONCAT('newpassword', `salt`)) WHERE `email` = 'specific@email.com';

-- Verification query to check updated passwords
SELECT 
    `uc_user_id`,
    `email`,
    `password`,
    `salt`,
    FROM_UNIXTIME(`update_time`) as last_updated
FROM `uc_user` 
WHERE `status` = 1 
ORDER BY `uc_user_id`;

-- Note: After running this script, all users can login with the password you set above