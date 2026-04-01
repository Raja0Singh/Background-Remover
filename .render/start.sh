#!/bin/bash

# Render Start Script for Background Remover API

set -e

echo "🚀 Starting Background Remover API..."

# Set default port if not provided
PORT=${PORT:-8000}

# Start the FastAPI application
echo "🌐 Starting server on port $PORT..."
uvicorn app:app --host 0.0.0.0 --port $PORT --workers 1
