const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

// Apply rate limiting to webhook endpoint
app.use('/api/webhook', apiLimiter);

// ULTRA-SECURE WEBHOOK ENDPOINT - COMPLETELY HIDDEN
app.post('/api/webhook', async (req, res) => {
    try {
        // 1. Get webhook URL from environment (NEVER exposed to frontend)
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        
        if (!webhookUrl) {
            console.error('Discord webhook URL not configured');
            return res.status(500).json({ error: 'Service unavailable' });
        }

        // 2. Enhanced payload validation
        const { content } = req.body;
        if (!content || typeof content !== 'string') {
            return res.status(400).json({ error: 'Invalid request format' });
        }

        // 3. Content sanitization and length limits
        if (content.length > 2000) {
            return res.status(400).json({ error: 'Content too long' });
        }

        // 4. Add request metadata (but hide webhook URL)
        const enhancedPayload = {
            content: content,
            embeds: [{
                footer: {
                    text: `Request ID: ${Date.now()}`
                },
                timestamp: new Date().toISOString()
            }]
        };

        // 5. Forward to Discord webhook (URL completely hidden)
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'RoScan-SecureProxy/2.0'
            },
            body: JSON.stringify(enhancedPayload)
        });

        if (response.ok) {
            // 6. Generic success response (no webhook details)
            res.json({ 
                success: true,
                id: Date.now(),
                status: 'delivered'
            });
        } else {
            console.error('Discord webhook error:', response.status);
            // 7. Generic error (no webhook URL exposed)
            res.status(500).json({ error: 'Delivery failed' });
        }
    } catch (error) {
        console.error('Webhook proxy error:', error.message);
        // 8. Generic error response (no internal details)
        res.status(500).json({ error: 'Service temporarily unavailable' });
    }
});

// STEALTH WEBHOOK ENDPOINT - Multiple disguised routes
app.post('/api/analytics', async (req, res) => {
    // This looks like analytics but is actually a webhook proxy
    return handleSecureWebhook(req, res);
});

app.post('/api/feedback', async (req, res) => {
    // This looks like feedback but is actually a webhook proxy
    return handleSecureWebhook(req, res);
});

app.post('/api/report', async (req, res) => {
    // This looks like a report endpoint but is actually a webhook proxy
    return handleSecureWebhook(req, res);
});

// Hidden webhook handler function
async function handleSecureWebhook(req, res) {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
            return res.status(500).json({ error: 'Service unavailable' });
        }

        const { content, data, message, feedback } = req.body;
        const actualContent = content || data || message || feedback;
        
        if (!actualContent || typeof actualContent !== 'string') {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        if (actualContent.length > 2000) {
            return res.status(400).json({ error: 'Data too long' });
        }

        // Send to Discord with stealth headers
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; Analytics/1.0)'
            },
            body: JSON.stringify({
                content: actualContent,
                embeds: [{
                    color: 0x00ff00,
                    footer: {
                        text: `Stealth • ${new Date().toLocaleString()}`
                    }
                }]
            })
        });

        if (response.ok) {
            res.json({ 
                status: 'processed',
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                message: 'Data submitted successfully'
            });
        } else {
            res.status(500).json({ error: 'Processing failed' });
        }
    } catch (error) {
        console.error('Stealth webhook error:', error.message);
        res.status(500).json({ error: 'Service error' });
    }
}

// ====== API ENDPOINTS EXAMPLES ======

// 1. Simple GET endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        message: 'RoScan API is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// 2. GET endpoint with URL parameters
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    
    // Simulate user data (in real app, you'd query a database)
    const userData = {
        id: userId,
        username: `user_${userId}`,
        scanCount: Math.floor(Math.random() * 100),
        joinDate: '2024-01-15',
        lastScan: new Date().toISOString()
    };
    
    res.json(userData);
});

// 3. GET endpoint with query parameters
app.get('/api/scans', (req, res) => {
    const { limit = 10, page = 1, type = 'all' } = req.query;
    
    // Simulate scan data
    const scans = [];
    for (let i = 1; i <= limit; i++) {
        scans.push({
            id: i + (page - 1) * limit,
            type: type === 'all' ? ['malware', 'clean', 'suspicious'][i % 3] : type,
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            result: Math.random() > 0.7 ? 'threat_detected' : 'clean'
        });
    }
    
    res.json({
        data: scans,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 250
        }
    });
});

// 4. POST endpoint for creating data
app.post('/api/scan', async (req, res) => {
    try {
        const { script, filename } = req.body;
        
        // Validate input
        if (!script) {
            return res.status(400).json({ error: 'Script content is required' });
        }
        
        // Simulate scan processing
        const scanResult = {
            id: Date.now(),
            filename: filename || 'untitled.ps1',
            status: 'completed',
            threats: Math.random() > 0.8 ? ['Suspicious network activity'] : [],
            riskLevel: Math.random() > 0.8 ? 'high' : 'low',
            scannedAt: new Date().toISOString(),
            processingTime: Math.random() * 2000 + 500 // ms
        };
        
        res.json(scanResult);
    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({ error: 'Scan processing failed' });
    }
});

// 5. PUT endpoint for updating data
app.put('/api/user/:id/settings', (req, res) => {
    const userId = req.params.id;
    const { notifications, theme, language } = req.body;
    
    // Simulate updating user settings
    const updatedSettings = {
        userId: userId,
        settings: {
            notifications: notifications || true,
            theme: theme || 'dark',
            language: language || 'en'
        },
        updatedAt: new Date().toISOString()
    };
    
    res.json(updatedSettings);
});

// 6. DELETE endpoint
app.delete('/api/scan/:id', (req, res) => {
    const scanId = req.params.id;
    
    // Simulate deletion
    res.json({
        message: `Scan ${scanId} deleted successfully`,
        deletedAt: new Date().toISOString()
    });
});

// 7. Endpoint with file upload (using express built-in)
app.post('/api/upload', (req, res) => {
    // Note: For actual file uploads, you'd use middleware like multer
    const { fileData, fileName } = req.body;
    
    if (!fileData) {
        return res.status(400).json({ error: 'No file data provided' });
    }
    
    res.json({
        message: 'File uploaded successfully',
        fileName: fileName,
        uploadId: Date.now(),
        size: fileData.length,
        uploadedAt: new Date().toISOString()
    });
});

// 8. Endpoint with authentication simulation
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple validation (in real app, check against database)
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    if (username === 'admin' && password === 'password123') {
        res.json({
            token: 'fake-jwt-token-' + Date.now(),
            user: {
                id: 1,
                username: username,
                role: 'admin'
            },
            expiresIn: '24h'
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// 9. Protected endpoint (with simple token validation)
app.get('/api/admin/stats', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('fake-jwt-token-')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    res.json({
        totalScans: 15432,
        threatsDetected: 234,
        activeUsers: 1205,
        serverUptime: process.uptime()
    });
});

// 10. Error handling endpoint
app.get('/api/error-test', (req, res) => {
    throw new Error('This is a test error');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('API Error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Serve static files for the website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static assets
app.use(express.static('.'));

// Handle 404 for API routes specifically
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});