#!/bin/bash
echo "🐳 Starting Task Board (Docker Version)..."
docker compose up -d
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5
echo ""
echo "📊 Service Status:"
docker compose ps
echo ""
echo "✅ Task Board is running!"
echo "🌐 Open https://localhost in your browser"
echo ""
echo "📝 Useful commands:"
echo "   docker compose logs -f     # View logs"
echo "   docker compose ps          # Check status"
echo "   docker compose down        # Stop all"
