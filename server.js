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

// Webhook proxy endpoint
app.post('/api/webhook', async (req, res) => {
    try {
        // Get webhook URL from environment variable
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        
        if (!webhookUrl) {
            console.error('Discord webhook URL not configured');
            return res.status(500).json({ error: 'Webhook not configured' });
        }

        // Validate payload
        const { content } = req.body;
        if (!content || typeof content !== 'string') {
            return res.status(400).json({ error: 'Invalid payload' });
        }

        // Forward to Discord webhook
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            res.json({ success: true });
        } else {
            console.error('Discord webhook error:', response.status, response.statusText);
            res.status(response.status).json({ error: 'Webhook request failed' });
        }
    } catch (error) {
        console.error('Webhook proxy error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});