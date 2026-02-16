#!/bin/bash
echo "🧪 Testing API Endpoints..."
echo ""

BASE_URL="https://localhost"
# Use -k to ignore SSL certificate warning for self-signed cert

echo "1. Health Check:"
curl -k -s $BASE_URL/api/health | jq .
echo ""

echo "2. Get All Tasks:"
curl -k -s $BASE_URL/api/tasks | jq .
echo ""

echo "3. Get Statistics:"
curl -k -s $BASE_URL/api/tasks/stats | jq .
echo ""

echo "4. Create New Task:"
curl -k -s -X POST $BASE_URL/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Test from script","description":"Created by test-api.sh","priority":"HIGH"}' | jq .
echo ""

echo "✅ API tests completed!"
