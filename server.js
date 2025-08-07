require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// External notification service URL
const NOTIFICATION_SERVICE_URL = process.env.DISCORD_WEBHOOK_URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API endpoint for security analysis results
app.post('/api/analysis', async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Analysis content is required' });
        }

        if (!NOTIFICATION_SERVICE_URL) {
            return res.status(500).json({ error: 'Notification service not configured' });
        }

        // Submit analysis results to notification service
        const response = await fetch(NOTIFICATION_SERVICE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            res.json({ status: 'success', message: 'Analysis results processed successfully' });
        } else {
            const errorText = await response.text();
            console.error('Notification service error:', response.status, errorText);
            res.status(response.status).json({ 
                error: 'Analysis processing failed', 
                details: response.status === 429 ? 'Service temporarily unavailable' : 'Processing error' 
            });
        }
    } catch (error) {
        console.error('Analysis processing error:', error);
        res.status(500).json({ error: 'Internal processing error' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'online', message: 'RoScan security analysis service operational' });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.json({ 
        service: 'RoScan Security Analysis', 
        version: '2.0.0',
        status: 'operational',
        features: ['PowerShell Analysis', 'Threat Detection', 'Item Scanning']
    });
});

app.listen(PORT, () => {
    console.log(`🚀 RoScan Security Analysis Server running on http://localhost:${PORT}`);
    console.log(`📡 Analysis API available at http://localhost:${PORT}/api/analysis`);
    console.log(`🌐 Security Scanner available at http://localhost:${PORT}`);
});

module.exports = app;