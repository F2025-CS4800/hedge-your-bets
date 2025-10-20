# API Testing with curl

Start Django server first:
```bash
cd backend
python manage.py runserver
```

## Test 1: Successful Prediction (Patrick Mahomes)
```bash
curl -X POST http://localhost:8000/api/predict-bet/ \
  -H "Content-Type: application/json" \
  -d "{\"player\": \"Patrick Mahomes\", \"action\": \"Passing Yards\", \"bet_type\": \"over\", \"action_amount\": 275.5, \"bet_amount\": 100.00}"
```

## Test 2: Player Not Found (with suggestions)
```bash
curl -X POST http://localhost:8000/api/predict-bet/ \
  -H "Content-Type: application/json" \
  -d "{\"player\": \"Pat Mahomes\", \"action\": \"Passing Yards\", \"bet_type\": \"over\", \"action_amount\": 250.5}"
```

## Test 3: Travis Kelce (TE)
```bash
curl -X POST http://localhost:8000/api/predict-bet/ \
  -H "Content-Type: application/json" \
  -d "{\"player\": \"Travis Kelce\", \"action\": \"Receptions\", \"bet_type\": \"over\", \"action_amount\": 5.5, \"bet_amount\": 75.00}"
```

## Test 4: Josh Allen Under Bet
```bash
curl -X POST http://localhost:8000/api/predict-bet/ \
  -H "Content-Type: application/json" \
  -d "{\"player\": \"Josh Allen\", \"action\": \"Passing Yards\", \"bet_type\": \"under\", \"action_amount\": 300.5, \"bet_amount\": 100.00}"
```

## Test 5: Invalid Stat for Position (Should Error)
```bash
curl -X POST http://localhost:8000/api/predict-bet/ \
  -H "Content-Type: application/json" \
  -d "{\"player\": \"Patrick Mahomes\", \"action\": \"Receptions\", \"bet_type\": \"over\", \"action_amount\": 5.5}"
```

## PowerShell Version

```powershell
# Test 1: Patrick Mahomes
Invoke-WebRequest -Uri "http://localhost:8000/api/predict-bet/" -Method POST -ContentType "application/json" -Body '{"player": "Patrick Mahomes", "action": "Passing Yards", "bet_type": "over", "action_amount": 275.5, "bet_amount": 100.00}' | Select-Object -Expand Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Test 2: Travis Kelce
Invoke-WebRequest -Uri "http://localhost:8000/api/predict-bet/" -Method POST -ContentType "application/json" -Body '{"player": "Travis Kelce", "action": "Receptions", "bet_type": "over", "action_amount": 5.5}' | Select-Object -Expand Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

