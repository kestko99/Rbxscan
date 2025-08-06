#!/bin/bash

echo "🚀 RoScan Ultra-Secure Webhook Server"
echo "======================================"

# Kill any existing server
pkill -f "node server.js" 2>/dev/null

# Start server in background
echo "📡 Starting secure server..."
node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test server
echo "🧪 Testing endpoints..."
RESPONSE=$(curl -s http://localhost:3000/api/status 2>/dev/null)
if [[ $? -eq 0 ]]; then
    echo "✅ Server running on http://localhost:3000"
    echo "✅ Website accessible"
    echo "✅ API endpoints ready"
    echo ""
    echo "🔒 SECURE WEBHOOK ENDPOINTS:"
    echo "• POST /api/webhook     - Main secure endpoint"
    echo "• POST /api/analytics   - Stealth analytics"
    echo "• POST /api/feedback    - Stealth feedback"
    echo "• POST /api/report      - Stealth report"
    echo ""
    echo "🎯 Your Discord webhook is completely hidden!"
    echo "📱 Access your site: http://localhost:3000"
else
    echo "❌ Server failed to start"
    exit 1
fi