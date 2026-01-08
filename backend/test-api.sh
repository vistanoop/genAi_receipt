#!/bin/bash
# Quick test script for backend API endpoints

BASE_URL="http://localhost:5000"

echo "==================================="
echo "Backend API Test Script"
echo "==================================="
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/health" | python3 -m json.tool || echo "Failed"
echo ""

# Test root endpoint
echo "2. Testing root endpoint..."
curl -s "$BASE_URL/" | python3 -m json.tool || echo "Failed"
echo ""

# Test signup (this will create a test user)
echo "3. Testing signup endpoint..."
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))")

if [ -n "$TOKEN" ]; then
  echo "Signup successful! Token obtained."
else
  echo "Signup failed or user already exists. Trying login..."
  TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}' | \
    python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))")
fi
echo ""

# Test authenticated endpoints
if [ -n "$TOKEN" ]; then
  echo "4. Testing /api/auth/me endpoint..."
  curl -s "$BASE_URL/api/auth/me" \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
  echo ""

  echo "5. Testing /api/user/profile endpoint..."
  curl -s "$BASE_URL/api/user/profile" \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
  echo ""

  echo "6. Testing GET /api/expenses endpoint..."
  curl -s "$BASE_URL/api/expenses" \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
  echo ""

  echo "7. Testing POST /api/expenses endpoint..."
  curl -s -X POST "$BASE_URL/api/expenses" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"amount":500,"category":"groceries","description":"Weekly groceries","date":"2024-01-15"}' | \
    python3 -m json.tool
  echo ""

  echo "8. Testing GET /api/expenses after adding one..."
  curl -s "$BASE_URL/api/expenses" \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
  echo ""
else
  echo "Could not obtain token. Skipping authenticated endpoint tests."
fi

echo ""
echo "==================================="
echo "Test script completed"
echo "==================================="
