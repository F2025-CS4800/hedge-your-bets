"""
Test script for Phase 3: API Endpoint Testing
Tests the /api/predict-bet/ endpoint with various scenarios.
"""

import requests
import json

# Base URL (make sure Django server is running!)
BASE_URL = "http://localhost:8000/api"

print("=" * 70)
print("PHASE 3 API ENDPOINT TESTING")
print("=" * 70)
print("\nMake sure Django server is running:")
print("  cd backend")
print("  python manage.py runserver")
print("\nPress Enter to continue...")
input()

# Test 1: Successful prediction
print("\n" + "="*70)
print("TEST 1: Successful Prediction (Patrick Mahomes)")
print("="*70)

payload = {
    "player": "Patrick Mahomes",
    "action": "Passing Yards",
    "bet_type": "over",
    "action_amount": 275.5,
    "bet_amount": 100.00
}

try:
    response = requests.post(f"{BASE_URL}/predict-bet/", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        print("[PASS] Prediction successful!")
        print(f"\nPlayer: {data['player']['name']} ({data['player']['position']})")
        print(f"Bet: {data['bet']['type'].upper()} {data['bet']['threshold']}")
        print(f"\nPredictions:")
        print(f"  q10: {data['prediction']['q10']:.1f}")
        print(f"  q50: {data['prediction']['q50']:.1f}")
        print(f"  q90: {data['prediction']['q90']:.1f}")
        print(f"\nAnalysis:")
        print(f"  Win Probability: {data['analysis']['win_probability']:.1%}")
        print(f"  Confidence: {data['analysis']['confidence_level']}")
        print(f"  Recommendation: {data['analysis']['recommendation']}")
        print(f"\nScenario ID: {data['scenario_id']}")
    else:
        print(f"[FAIL] {response.json()}")
except Exception as e:
    print(f"[ERROR] {e}")

# Test 2: Player not found (with suggestions)
print("\n" + "="*70)
print("TEST 2: Player Not Found (should return suggestions)")
print("="*70)

payload = {
    "player": "Pat Mahomes",  # Incorrect name
    "action": "Passing Yards",
    "bet_type": "over",
    "action_amount": 250.5,
    "bet_amount": 50.00
}

try:
    response = requests.post(f"{BASE_URL}/predict-bet/", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 404:
        data = response.json()
        print("[PASS] Correctly returned 404 with suggestions")
        print(f"Error: {data['error']}")
        if 'suggestions' in data:
            print(f"Suggestions: {', '.join(data['suggestions'][:3])}")
    else:
        print(f"[FAIL] Expected 404, got {response.status_code}")
except Exception as e:
    print(f"[ERROR] {e}")

# Test 3: Invalid stat for position
print("\n" + "="*70)
print("TEST 3: Invalid Stat for Position")
print("="*70)

payload = {
    "player": "Patrick Mahomes",
    "action": "Receptions",  # QBs don't have reception models
    "bet_type": "over",
    "action_amount": 5.5,
    "bet_amount": 50.00
}

try:
    response = requests.post(f"{BASE_URL}/predict-bet/", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 400:
        data = response.json()
        print("[PASS] Correctly returned error for invalid stat")
        print(f"Error: {data['error']}")
    else:
        print(f"[FAIL] Expected 400, got {response.status_code}")
        print(response.json())
except Exception as e:
    print(f"[ERROR] {e}")

# Test 4: Different position (TE)
print("\n" + "="*70)
print("TEST 4: Different Position (Travis Kelce - TE)")
print("="*70)

payload = {
    "player": "Travis Kelce",
    "action": "Receptions",
    "bet_type": "over",
    "action_amount": 5.5,
    "bet_amount": 75.00
}

try:
    response = requests.post(f"{BASE_URL}/predict-bet/", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        print("[PASS] Prediction successful!")
        print(f"Player: {data['player']['name']} ({data['player']['position']})")
        print(f"Predicted: {data['prediction']['q50']:.1f} receptions")
        print(f"Win Probability: {data['analysis']['win_probability']:.1%}")
        print(f"Recommendation: {data['analysis']['recommendation']}")
    else:
        print(f"[FAIL] {response.json()}")
except Exception as e:
    print(f"[ERROR] {e}")

# Test 5: Under bet
print("\n" + "="*70)
print("TEST 5: Under Bet (Josh Allen)")
print("="*70)

payload = {
    "player": "Josh Allen",
    "action": "Passing Yards",
    "bet_type": "under",
    "action_amount": 300.5,
    "bet_amount": 100.00
}

try:
    response = requests.post(f"{BASE_URL}/predict-bet/", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        print("[PASS] Prediction successful!")
        print(f"Bet Type: {data['bet']['type'].upper()}")
        print(f"Predicted: {data['prediction']['q50']:.1f} yards")
        print(f"Win Probability: {data['analysis']['win_probability']:.1%}")
    else:
        print(f"[FAIL] {response.json()}")
except Exception as e:
    print(f"[ERROR] {e}")

# Test 6: Missing required field
print("\n" + "="*70)
print("TEST 6: Missing Required Field")
print("="*70)

payload = {
    "player": "Patrick Mahomes",
    # Missing action, bet_type, action_amount
}

try:
    response = requests.post(f"{BASE_URL}/predict-bet/", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 400:
        data = response.json()
        print("[PASS] Correctly returned validation error")
        print(f"Error: {data['error']}")
    else:
        print(f"[FAIL] Expected 400, got {response.status_code}")
except Exception as e:
    print(f"[ERROR] {e}")

# Summary
print("\n" + "="*70)
print("TESTING COMPLETE")
print("="*70)
print("\nAll tests completed!")
print("\nTo view saved predictions:")
print("  1. Visit: http://localhost:8000/admin")
print("  2. Login: admin / admin123")
print("  3. Click 'Betting Scenarios'")

