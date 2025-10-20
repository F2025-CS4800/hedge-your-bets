# 🚀 Complete Startup Guide - Hedge Your Bets

Your complete AI-powered sports betting analysis system is ready! Follow these steps to run it.

---

## ⚡ Quick Start (First Time Setup)

### **1. Create Frontend Environment File** (ONE-TIME ONLY)

**Run this PowerShell command in the `frontend` directory:**
```powershell
cd frontend
.\create-env.ps1
```

**OR manually create `frontend/.env.local` with:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

### **2. Start Backend Server**

**Terminal 1:**
```bash
cd backend
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ **Backend running on http://localhost:8000**

---

### **3. Start Frontend Server**

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

✅ **Frontend running on http://localhost:3000**

---

### **4. Access the Application**

Open browser: **http://localhost:3000**

---

## 📋 Complete Testing Checklist

### **✅ Phase 1: ML Service**
- [x] 56 models trained and loaded
- [x] Lazy loading working
- [x] Predictions accurate
- [x] Test: `python backend/ml_service/test_service.py`

### **✅ Phase 2: Database**
- [x] 8,120 players imported
- [x] 38,200 game records (2019-2025)
- [x] Data access layer working
- [x] Test: `python backend/test_phase2.py`

### **✅ Phase 3: API Endpoints**
- [x] `/api/predict-bet/` endpoint working
- [x] `/api/players/` endpoint working
- [x] CORS configured
- [x] Error handling with suggestions
- [x] Test: `python backend/quick_api_test.py`

### **✅ Phase 4: Frontend Integration**
- [x] Dynamic player loading
- [x] API calls working
- [x] Results display beautiful
- [x] Loading states working
- [x] Error handling elegant
- [x] Test: Run both servers, use the web interface!

---

## 🎯 Testing the Complete System

### **Test 1: Basic Flow**
1. Visit http://localhost:3000
2. Sign in (if required)
3. Select Team: "Kansas City Chiefs"
4. **Watch players load dynamically!** (should see many more than before)
5. Select Player: "Patrick Mahomes (QB)"
6. Select Bet Type: "Over"
7. Select Action: "Passing Yards"
8. Enter Action Amount: 275.5
9. Enter Bet Amount: 100
10. Click "Analyze Bet"
11. **Watch it analyze!** (spinner appears)
12. **See results!** (predictions, win probability, recommendation)

### **Test 2: Different Position (TE)**
1. Select Team: "Kansas City Chiefs"
2. Select Player: "Travis Kelce (TE)"
3. Action: "Receptions"
4. Bet Type: "Over"
5. Action Amount: 5.5
6. Click "Analyze Bet"
7. **Should see TE-specific prediction!**

### **Test 3: Under Bet (Should Show "Good Bet")**
1. Select Team: "Buffalo Bills"
2. Select Player: "Josh Allen (QB)"
3. Action: "Passing Yards"
4. Bet Type: "Under"
5. Action Amount: 300.5
6. Click "Analyze Bet"
7. **Should show high win probability (~95%) and "Good Bet" ✅**

---

## 🎨 What You Should See

### **Before Analyzing:**
- Clean betting form
- Dropdown menus
- Modern blue/purple gradient design

### **During Analysis:**
- Button: "🔄 Analyzing Your Bet..." (disabled)
- Message: "Please wait while we analyze player statistics..."

### **After Analysis:**
```
═══════════════════════════════════════
📊 PREDICTION RESULTS
═══════════════════════════════════════

Bet Details:
  Player: Patrick Mahomes (QB) - KC
  Stat: Passing Yards
  Bet: OVER 275.5

Predicted Performance:
┌─────────────┬─────────────┬─────────────┐
│ Pessimistic │ Most Likely │ Optimistic  │
│    223.0    │    235.4    │    245.9    │
│ 10th %ile   │ 50th %ile   │ 90th %ile   │
└─────────────┴─────────────┴─────────────┘

Win Probability: 5.0%
[███░░░░░░░░░░░░░░░░░░░] 5%  ← Red bar

Recommendation: Poor Bet ❌
  Confidence: High
  Expected Value: -0.900

Analysis based on 8 recent games
Prediction for Week 8, 2025
═══════════════════════════════════════
```

---

## 🗄️ View Saved Predictions

All predictions are saved to database!

**Access Django Admin:**
```bash
# Make sure backend is running
# Visit: http://localhost:8000/admin
# Login: admin / admin123
# Click: Betting Scenarios
```

You'll see:
- All submitted bets
- Player, action, amounts
- **Full ML predictions stored!**
- Win probability, confidence, recommendation
- Timestamp

---

## 📡 API Endpoints Available

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/hello/` | GET | Test endpoint |
| `/api/predict-bet/` | POST | Make ML prediction |
| `/api/players/?team=KC` | GET | Get players for team |
| `/api/betting-scenarios/list/` | GET | Get prediction history |

---

## 🔧 Troubleshooting

### **Players not loading dynamically:**
1. Check `.env.local` exists in `frontend/`
2. Restart frontend server (Ctrl+C, then `npm run dev`)
3. Check backend is running
4. Check browser console (F12) for errors

### **"CORS policy error":**
1. Check backend CORS settings allow `http://localhost:3000`
2. Restart backend server
3. Clear browser cache

### **"Prediction fails":**
1. Check backend console for errors
2. Verify player has game data in database
3. Try `python backend/quick_api_test.py` to test backend directly

### **"Players show as loading forever":**
1. Check backend is running
2. Test API directly: http://localhost:8000/api/players/?team=KC
3. Check browser Network tab (F12)

---

## 📊 System Status

| Component | Status | Records/Files |
|-----------|--------|---------------|
| **ML Models** | ✅ Ready | 56 models loaded |
| **Database** | ✅ Ready | 8,120 players, 38,200 games |
| **Backend API** | ✅ Ready | 2 endpoints active |
| **Frontend** | ✅ Ready | React components integrated |
| **Integration** | ✅ Ready | End-to-end tested |

---

## 🎓 How It Works

1. **User selects team** → Frontend calls `/api/players/?team=KC`
2. **Backend queries database** → Returns all KC players
3. **User selects player + bet details** → Frontend validates inputs
4. **User clicks "Analyze Bet"** → Frontend calls `/api/predict-bet/`
5. **Backend looks up player** → Gets player ID, position, team
6. **Backend gets player history** → Last 8 games from database
7. **Backend calls ML service** → Loads models, makes prediction
8. **ML returns 3 predictions** → q10, q50, q90
9. **Backend calculates analysis** → Win probability, recommendation
10. **Backend saves to database** → Stores complete scenario + prediction
11. **Backend returns JSON** → Complete prediction results
12. **Frontend displays beautifully** → Color-coded, visual indicators
13. **User sees recommendation** → Make informed betting decision! 🎯

---

## 🆕 For Your Teammate (EC2 Deployment)

Send them `EC2_QUESTIONS_FOR_TEAMMATE.md` and get:
- Production frontend URL
- Production backend URL

Then update:
1. `backend/hedge_bets/settings.py` - Add EC2 URL to CORS_ALLOWED_ORIGINS
2. `frontend/.env.production` - Set NEXT_PUBLIC_API_URL to EC2 backend

---

## 🎉 You're Done!

You now have a complete, working AI-powered sports betting analysis application!

**What you built:**
- Machine Learning prediction engine
- NFL player database (7 years of data!)
- REST API backend
- Modern React frontend
- Complete integration

**Next enhancements you could add:**
- More teams/players
- Historical prediction tracking
- Visualization charts
- Betting strategy tools
- Social features

---

**Enjoy your Hedge Your Bets application!** 🎊

