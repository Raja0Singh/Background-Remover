#!/bin/bash

# Vercel Deployment Script for Background Remover Frontend

echo "🚀 Starting Vercel Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if environment variable is set
if [ -z "$VITE_API_BASE_URL" ]; then
    echo "⚠️  VITE_API_BASE_URL not set. Please set it in Vercel dashboard."
    echo "📝 Go to: https://vercel.com/dashboard > Your Project > Settings > Environment Variables"
    echo "🔑 Add: VITE_API_BASE_URL = https://your-backend-url.vercel.app"
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Don't forget to set VITE_API_BASE_URL in Vercel dashboard"
