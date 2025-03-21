#!/bin/bash

# Kill existing processes
pkill -f "node|ngrok"

# Start the development servers
npm run dev &

# Wait for servers to start
sleep 5

# Start ngrok with random URL
ngrok http 3001
