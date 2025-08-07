// Simple test endpoint for Vercel deployment verification

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Return success response
    res.status(200).json({
        success: true,
        message: 'Vercel API is working!',
        method: req.method,
        timestamp: new Date().toISOString(),
        url: req.url,
        headers: req.headers
    });
}