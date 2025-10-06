# Database Integration for RbxScan

This directory contains database-related files for the RbxScan platform.

## Files

- `schema.sql` - Database table structure and indexes
- `user_records.sql` - User data INSERT statements
- `README.md` - This documentation file

## Database Setup

### 1. Create the Database Schema

First, run the schema file to create the necessary tables:

```sql
mysql -u your_username -p your_database_name < database/schema.sql
```

### 2. Insert User Records

Then, insert the user data:

```sql
mysql -u your_username -p your_database_name < database/user_records.sql
```

## Table Structure: `uc_user`

| Column | Type | Description |
|--------|------|-------------|
| `uc_user_id` | INT(11) | Primary key, auto-increment user ID |
| `email` | VARCHAR(255) | User email address (unique) |
| `nick_name` | VARCHAR(100) | User nickname (optional) |
| `password` | VARCHAR(32) | MD5 hashed password |
| `salt` | VARCHAR(6) | Password salt for security |
| `reg_ip` | VARCHAR(45) | Registration IP address |
| `create_time` | INT(11) | Unix timestamp of account creation |
| `update_time` | INT(11) | Unix timestamp of last update |
| `email_status` | TINYINT(1) | Email verification status (0=unverified, 1=verified) |
| `status` | TINYINT(1) | Account status (0=inactive, 1=active) |

## User Data Summary

The provided dataset contains **23 user records** with IDs ranging from 146649 to 146671.

### Key Statistics:
- **Total Users**: 23
- **Email Status**: All users have unverified emails (email_status = 0)
- **Account Status**: All users are active (status = 1)
- **Registration Period**: All users registered on May 15, 2017 (Unix timestamp ~1494879000)
- **Nicknames**: All nickname fields are empty
- **Registration IPs**: All reg_ip fields are empty

## Security Considerations

⚠️ **Important Security Notes:**

1. **Password Hashing**: The current system uses MD5 hashing, which is considered insecure. Consider upgrading to bcrypt or Argon2.

2. **Salt Length**: The salt is only 6 characters, which is insufficient for modern security standards. Recommend at least 16 characters.

3. **Email Verification**: All users have unverified emails. Implement email verification flow.

4. **Data Validation**: Ensure proper validation for email formats and password strength.

## Integration with RbxScan Frontend

To integrate this user system with the current RbxScan frontend:

1. **Add Backend API**: Create a backend service (Node.js, Python, PHP, etc.) to handle user authentication
2. **Database Connection**: Configure database connection in your backend
3. **Authentication Endpoints**: Implement login, register, and user management endpoints
4. **Frontend Integration**: Update the JavaScript to communicate with the backend API

## Example Backend Integration (Node.js)

```javascript
// Example user authentication endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Query user from database
    const user = await db.query('SELECT * FROM uc_user WHERE email = ? AND status = 1', [email]);
    
    if (user && validatePassword(password, user.password, user.salt)) {
        // Generate JWT token
        const token = jwt.sign({ userId: user.uc_user_id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});
```

## Database Recommendations

1. **Use Environment Variables**: Store database credentials securely
2. **Connection Pooling**: Implement connection pooling for better performance
3. **Backup Strategy**: Set up regular database backups
4. **Monitoring**: Implement database monitoring and logging
5. **Indexing**: The schema includes optimized indexes for common queries

## Next Steps

1. Set up a backend server (Express.js, Flask, etc.)
2. Configure database connection
3. Implement user authentication API
4. Update frontend to use authentication
5. Add user registration and profile management features