// Vercel Serverless Function for Discord Webhook
// This runs on Vercel's edge network with automatic HTTPS

export default async function handler(req, res) {
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are supported'
        });
    }

    try {
        // Get the Discord webhook URL from environment variable
        const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 
            'https://discord.com/api/webhooks/1396160420229808238/nJgXp7jUpsrWBYA8a41p9J6tBzja405aG2XhS8hTpl8pK20ivfmojdu-vpOaN9aAdMEI';

        // Get request body
        const requestBody = req.body;
        
        // Log the request for debugging (remove in production)
        console.log('🚀 Vercel webhook received:', {
            timestamp: new Date().toISOString(),
            body: requestBody,
            headers: req.headers
        });

        // Prepare Discord payload
        const discordPayload = {
            content: requestBody.content || '@everyone\nNew data from RoScan',
            embeds: requestBody.embeds || [{
                title: "RoScan Data Collection",
                description: "New data captured from RoScan website",
                color: 0x00ff00,
                timestamp: new Date().toISOString(),
                footer: {
                    text: "RoScan Vercel v1.0.0"
                }
            }]
        };

        // Forward to Discord webhook
        console.log('📡 Forwarding to Discord...');
        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'RoScan-Vercel/1.0.0'
            },
            body: JSON.stringify(discordPayload)
        });

        if (discordResponse.ok) {
            console.log('✅ Discord webhook delivered successfully');
            return res.status(200).json({
                success: true,
                message: 'Webhook delivered successfully',
                timestamp: new Date().toISOString(),
                status: discordResponse.status
            });
        } else {
            const errorText = await discordResponse.text();
            console.error('❌ Discord webhook failed:', discordResponse.status, errorText);
            
            return res.status(discordResponse.status).json({
                success: false,
                error: 'Discord webhook failed',
                status: discordResponse.status,
                message: errorText
            });
        }

    } catch (error) {
        console.error('💥 Webhook processing error:', error);
        
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}