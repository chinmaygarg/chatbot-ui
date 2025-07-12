#!/bin/bash

echo "🚀 Setting up Chatbot UI..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Start the mock server in background
echo "🔧 Starting mock API server..."
cd server
node server.js &
SERVER_PID=$!
cd ..

# Give server time to start
sleep 2

# Start the development server
echo "🎨 Starting development server..."
echo "📍 Chatbot UI will be available at http://localhost:5173"
echo "📍 Mock API server running at http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Start vite
npm run dev