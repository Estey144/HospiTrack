#!/bin/bash

# JWT Test Script for HospiTrack
echo "🚀 Testing JWT Implementation for HospiTrack"
echo "============================================="

BASE_URL="http://localhost:8080"

# Test 1: Login and get JWT token
echo "📝 Test 1: Login and get JWT token"
LOGIN_RESPONSE=$(curl -s -X POST \
  ${BASE_URL}/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token from response (assuming JSON format)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ JWT Token received: ${TOKEN:0:20}..."
    
    # Test 2: Access protected endpoint with token
    echo ""
    echo "🔒 Test 2: Access protected endpoint with JWT token"
    PROTECTED_RESPONSE=$(curl -s -X GET \
      ${BASE_URL}/api/appointments/patient/1 \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json")
    
    echo "Protected endpoint response: $PROTECTED_RESPONSE"
    
    # Test 3: Access protected endpoint without token
    echo ""
    echo "❌ Test 3: Access protected endpoint without token (should fail)"
    UNAUTH_RESPONSE=$(curl -s -X GET \
      ${BASE_URL}/api/appointments/patient/1 \
      -H "Content-Type: application/json")
    
    echo "Unauthorized response: $UNAUTH_RESPONSE"
    
else
    echo "❌ Failed to get JWT token from login"
fi

echo ""
echo "🎯 JWT Implementation Test Complete!"
echo "============================================="
