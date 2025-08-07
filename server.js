const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// In-memory user storage (use a real database in production)
const users = new Map();

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        if (users.has(username)) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate 2FA secret
        const secret = speakeasy.generateSecret({
            name: `2FA Demo (${username})`,
            issuer: '2FA Authentication System',
            length: 32
        });
        
        // Store user
        users.set(username, {
            password: hashedPassword,
            twoFactorSecret: secret.base32,
            twoFactorEnabled: false
        });
        
        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        
        res.json({
            message: 'User registered successfully',
            qrCode: qrCodeUrl,
            secret: secret.base32,
            manualEntryKey: secret.base32
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        const user = users.get(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Store user in session for 2FA verification
        req.session.pendingUser = username;
        
        res.json({
            message: 'Password verified',
            requires2FA: user.twoFactorEnabled,
            next: user.twoFactorEnabled ? 'verify-2fa' : 'enable-2fa'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Enable 2FA endpoint
app.post('/enable-2fa', (req, res) => {
    try {
        const { token } = req.body;
        const username = req.session.pendingUser;
        
        if (!username || !token) {
            return res.status(400).json({ error: 'Missing username or token' });
        }
        
        const user = users.get(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2
        });
        
        if (verified) {
            user.twoFactorEnabled = true;
            users.set(username, user);
            req.session.user = username;
            delete req.session.pendingUser;
            
            res.json({
                message: '2FA enabled successfully',
                authenticated: true
            });
        } else {
            res.status(400).json({ error: 'Invalid token' });
        }
        
    } catch (error) {
        console.error('Enable 2FA error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify 2FA endpoint
app.post('/verify-2fa', (req, res) => {
    try {
        const { token } = req.body;
        const username = req.session.pendingUser;
        
        if (!username || !token) {
            return res.status(400).json({ error: 'Missing username or token' });
        }
        
        const user = users.get(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify the token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2
        });
        
        if (verified) {
            req.session.user = username;
            delete req.session.pendingUser;
            
            res.json({
                message: '2FA verification successful',
                authenticated: true
            });
        } else {
            res.status(400).json({ error: 'Invalid token' });
        }
        
    } catch (error) {
        console.error('Verify 2FA error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get QR code for existing user (if they need to re-setup)
app.get('/qr-code', async (req, res) => {
    try {
        const username = req.session.pendingUser || req.session.user;
        
        if (!username) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const user = users.get(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Create otpauth URL
        const otpauthUrl = speakeasy.otpauthURL({
            secret: user.twoFactorSecret,
            label: username,
            issuer: '2FA Authentication System',
            encoding: 'base32'
        });
        
        // Generate QR code
        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);
        
        res.json({
            qrCode: qrCodeUrl,
            secret: user.twoFactorSecret,
            manualEntryKey: user.twoFactorSecret
        });
        
    } catch (error) {
        console.error('QR code generation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Dashboard endpoint (protected)
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = users.get(req.session.user);
    
    res.json({
        message: 'Welcome to your dashboard!',
        username: req.session.user,
        twoFactorEnabled: user ? user.twoFactorEnabled : false,
        loginTime: new Date().toISOString()
    });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Disable 2FA endpoint
app.post('/disable-2fa', async (req, res) => {
    try {
        const { password, token } = req.body;
        const username = req.session.user;
        
        if (!username) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        
        const user = users.get(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        // Verify current 2FA token
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: token,
            window: 2
        });
        
        if (!verified) {
            return res.status(400).json({ error: 'Invalid 2FA token' });
        }
        
        // Disable 2FA
        user.twoFactorEnabled = false;
        users.set(username, user);
        
        res.json({ message: '2FA disabled successfully' });
        
    } catch (error) {
        console.error('Disable 2FA error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user status
app.get('/status', (req, res) => {
    if (req.session.user) {
        const user = users.get(req.session.user);
        res.json({
            authenticated: true,
            username: req.session.user,
            twoFactorEnabled: user ? user.twoFactorEnabled : false
        });
    } else if (req.session.pendingUser) {
        res.json({
            authenticated: false,
            pending2FA: true,
            username: req.session.pendingUser
        });
    } else {
        res.json({
            authenticated: false,
            pending2FA: false
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🔐 2FA Authentication Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to access the system`);
    console.log(`🔑 Features: Registration, Login, 2FA Setup, TOTP Verification`);
});

module.exports = app;