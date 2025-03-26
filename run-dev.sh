#!/bin/bash

# Kill existing processes
pkill -f "node|ngrok"

# Start the development servers
npm run dev &

# Wait for servers to start
sleep 5

# Start ngrok with reserved domain
ngrok http --domain=mosh.ngrok.app 3001
