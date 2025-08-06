#!/bin/bash

echo "🔧 RoScan - Starting secure webhook server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created. Please edit it with your Discord webhook URL."
        echo "📝 Edit .env and set your DISCORD_WEBHOOK_URL"
    else
        echo "❌ .env.example not found. Please create a .env file manually."
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Starting server on http://localhost:3000"
npm start