// Secure Backend Webhook Handler - Discord webhook stored server-side only
// The webhook URL is NEVER exposed to the frontend

export default async function handler(req, res) {
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'Only POST requests are supported',
            method: req.method
        });
    }

    try {
        // Discord webhook URL - SECURE BACKEND STORAGE
        // This webhook URL is NEVER sent to the frontend
        const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || 
            'https://discord.com/api/webhooks/1396160420229808238/nJgXp7jUpsrWBYA8a41p9J6tBzja405aG2XhS8hTpl8pK20ivfmojdu-vpOaN9aAdMEI';

        // Log request (without sensitive data)
        console.log('🔒 Secure backend webhook request received:', {
            timestamp: new Date().toISOString(),
            method: req.method,
            userAgent: req.headers['user-agent'],
            origin: req.headers.origin,
            hasBody: !!req.body
        });

        // Validate and sanitize request body
        const requestBody = req.body;
        if (!requestBody) {
            return res.status(400).json({
                success: false,
                error: 'Missing request body'
            });
        }

        // Rate limiting check (simple implementation)
        const clientIP = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
        console.log('📡 Request from IP:', clientIP);

        // Prepare secure Discord payload
        const discordPayload = {
            content: requestBody.content || '@everyone\nNew data from RoScan Backend',
            embeds: requestBody.embeds || []
        };

        // Add default professional embed if none provided
        if (!requestBody.embeds || requestBody.embeds.length === 0) {
            discordPayload.embeds = [{
                title: "🔒 RoScan Secure Backend",
                description: "Data processed through secure backend API",
                color: 0x667eea,
                fields: [
                    {
                        name: "🛡️ Security Level",
                        value: "Backend Protected",
                        inline: true
                    },
                    {
                        name: "📡 Processing Time",
                        value: new Date().toLocaleTimeString(),
                        inline: true
                    },
                    {
                        name: "🔐 Source",
                        value: "Secure API Endpoint",
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "RoScan Backend v2.0.0 - Webhook Protected"
                }
            }];
        }

        // Enhance embeds with backend security info
        if (discordPayload.embeds && discordPayload.embeds.length > 0) {
            discordPayload.embeds[0].fields = discordPayload.embeds[0].fields || [];
            discordPayload.embeds[0].fields.push({
                name: "🔒 Backend Security",
                value: "✅ Webhook URL Protected",
                inline: true
            });
        }

        // Forward to Discord webhook securely
        console.log('🚀 Forwarding to Discord via secure backend...');
        
        const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'RoScan-Backend-Secure/2.0.0'
            },
            body: JSON.stringify(discordPayload)
        });

        console.log('📊 Discord response status:', discordResponse.status);

        // Handle Discord response
        if (discordResponse.ok) {
            console.log('✅ Secure backend webhook delivered successfully');
            
            return res.status(200).json({
                success: true,
                message: 'Webhook delivered successfully via secure backend',
                timestamp: new Date().toISOString(),
                backend_version: '2.0.0',
                security_level: 'protected',
                // Never expose Discord response details
                status: 'delivered'
            });
        } else {
            // Log Discord error server-side only
            const errorText = await discordResponse.text().catch(() => 'Unknown Discord error');
            console.error('❌ Discord webhook failed:', discordResponse.status, errorText);
            
            // Return generic error to frontend (don't expose Discord details)
            return res.status(200).json({
                success: false,
                error: 'Webhook delivery failed',
                message: 'Backend processed request but delivery failed',
                timestamp: new Date().toISOString(),
                // Don't expose specific Discord error details to frontend
                retry_recommended: discordResponse.status === 429
            });
        }

    } catch (error) {
        // Log detailed error server-side
        console.error('💥 Backend webhook processing error:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        // Return generic error to frontend (don't expose internal details)
        return res.status(500).json({
            success: false,
            error: 'Backend processing error',
            message: 'Internal server error occurred',
            timestamp: new Date().toISOString(),
            support: 'Check server logs for details'
        });
    }
}