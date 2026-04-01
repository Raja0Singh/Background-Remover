#!/bin/bash

# Render Build Script for Background Remover API

set -e

echo "🚀 Starting build process..."

# Install Python dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
echo "🗄️ Initializing database..."
python database.py

echo "✅ Build completed successfully!"
