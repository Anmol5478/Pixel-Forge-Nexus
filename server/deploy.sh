#!/bin/bash

echo "🚀 Deploying PixelForge Nexus Server..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create logs directory
mkdir -p logs

# Start with PM2
echo "🔄 Starting server with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

echo "✅ Server deployed successfully!"
echo "📊 Check status with: pm2 status"
echo "📋 View logs with: pm2 logs pixelforge-nexus-server" 