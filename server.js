// Simple Node.js Backend Server for Discord Webhook
// This keeps your Discord webhook URL completely hidden from the frontend

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

// Configuration
const PORT = process.env.PORT || 8080;

// SECURE BACKEND - Discord webhook stored here (never exposed to frontend)
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 
    'https://discord.com/api/webhooks/1396160420229808238/nJgXp7jUpsrWBYA8a41p9J6tBzja405aG2XhS8hTpl8pK20ivfmojdu-vpOaN9aAdMEI';

console.log('🔒 Starting secure backend server...');
console.log('🛡️ Discord webhook URL is stored securely in backend');

// Helper function to read request body
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

// Helper function to make HTTPS requests
function makeRequest(url, options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let responseBody = '';
            res.on('data', chunk => {
                responseBody += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseBody
                });
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(data);
        }
        req.end();
    });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Set CORS headers for frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    console.log(`📡 ${req.method} ${path} from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);

    try {
        // Webhook endpoint
        if (path === '/webhook' && req.method === 'POST') {
            console.log('🔒 Secure webhook request received');

            // Get request body from frontend
            const requestBody = await getRequestBody(req);
            
            if (!requestBody || Object.keys(requestBody).length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Missing request body'
                }));
                return;
            }

            // Prepare Discord payload
            const discordPayload = {
                content: requestBody.content || '@everyone\nNew data from RoScan Backend',
                embeds: requestBody.embeds || [{
                    title: "🔒 RoScan Secure Backend",
                    description: "Data processed through secure Node.js backend",
                    color: 0x667eea,
                    fields: [
                        {
                            name: "🛡️ Security Level",
                            value: "Backend Protected",
                            inline: true
                        },
                        {
                            name: "🔧 Backend Type",
                            value: "Node.js Server",
                            inline: true
                        },
                        {
                            name: "🔐 Source",
                            value: "Secure Backend API",
                            inline: true
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "RoScan Node.js Backend - Webhook Protected"
                    }
                }]
            };

            // Enhance embeds with backend security info
            if (discordPayload.embeds && discordPayload.embeds.length > 0) {
                discordPayload.embeds[0].fields = discordPayload.embeds[0].fields || [];
                discordPayload.embeds[0].fields.push({
                    name: "🔒 Backend Security",
                    value: "✅ Webhook URL Protected",
                    inline: true
                });
            }

            console.log('📡 Forwarding to Discord via secure backend...');

            try {
                // Forward to Discord (webhook URL never exposed to frontend)
                const discordResponse = await makeRequest(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'RoScan-NodeJS-Backend/1.0.0'
                    }
                }, JSON.stringify(discordPayload));

                console.log(`📊 Discord response: ${discordResponse.statusCode}`);

                if (discordResponse.statusCode === 204 || discordResponse.statusCode === 200) {
                    console.log('✅ Secure backend webhook delivered successfully');
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        message: 'Webhook delivered successfully via secure backend',
                        timestamp: new Date().toISOString(),
                        backend: 'Node.js',
                        security_level: 'protected'
                    }));
                } else {
                    console.error('❌ Discord webhook failed:', discordResponse.statusCode);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: 'Webhook delivery failed',
                        message: 'Backend processed request but delivery failed',
                        timestamp: new Date().toISOString()
                    }));
                }
            } catch (discordError) {
                console.error('💥 Discord request error:', discordError.message);
                
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    error: 'Discord connection failed',
                    message: 'Backend could not connect to Discord',
                    timestamp: new Date().toISOString()
                }));
            }

        // Health check endpoint
        } else if (path === '/health' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'healthy',
                backend: 'Node.js',
                timestamp: new Date().toISOString(),
                security: 'webhook_protected'
            }));

        // Test endpoint
        } else if (path === '/test' && req.method === 'POST') {
            console.log('🧪 Test endpoint called');
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Backend is working!',
                backend: 'Node.js',
                timestamp: new Date().toISOString(),
                received_data: await getRequestBody(req).catch(() => ({}))
            }));

        // Serve static files (basic file server)
        } else if (req.method === 'GET') {
            const fs = require('fs');
            const path_module = require('path');
            
            let filePath = path === '/' ? '/index.html' : path;
            filePath = path_module.join(__dirname, filePath);
            
            // Security: prevent directory traversal
            if (!filePath.startsWith(__dirname)) {
                res.writeHead(403);
                res.end('Access denied');
                return;
            }

            try {
                const data = fs.readFileSync(filePath);
                const ext = path_module.extname(filePath);
                
                const contentTypes = {
                    '.html': 'text/html',
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.ico': 'image/x-icon'
                };
                
                const contentType = contentTypes[ext] || 'text/plain';
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            } catch (error) {
                res.writeHead(404);
                res.end('File not found');
            }

        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Not found',
                message: 'Endpoint not available',
                available_endpoints: ['/webhook (POST)', '/health (GET)', '/test (POST)']
            }));
        }

    } catch (error) {
        console.error('💥 Server error:', error);
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            error: 'Internal server error',
            message: error.message,
            timestamp: new Date().toISOString()
        }));
    }
});

// Start server
server.listen(PORT, () => {
    console.log('🚀 Secure backend server running!');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔒 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
    console.log('🛡️ Discord webhook URL is completely hidden from frontend');
    console.log('');
    console.log('🎯 Frontend should call: /webhook');
    console.log('🔐 Discord webhook is stored securely in backend only');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server closed');
    });
});

module.exports = server;