require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Discord webhook URL (loaded from environment variables)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API endpoint to forward data to Discord webhook
app.post('/api/webhook', async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (!DISCORD_WEBHOOK_URL) {
            return res.status(500).json({ error: 'Webhook URL not configured' });
        }

        // Forward to Discord webhook
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            res.json({ status: 'success', message: 'Data sent successfully' });
        } else {
            const errorText = await response.text();
            console.error('Discord webhook error:', response.status, errorText);
            res.status(response.status).json({ 
                error: 'Webhook failed', 
                details: response.status === 429 ? 'Rate limited' : 'Unknown error' 
            });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Webhook API available at http://localhost:${PORT}/api/webhook`);
    console.log(`🌐 Website available at http://localhost:${PORT}`);
});

module.exports = app;