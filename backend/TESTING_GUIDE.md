# 🧪 Phase 2 Testing Guide

Complete guide for testing the database and ML integration.

---

## 📋 **Quick Reference**

### **Option 1: Run Full Test Suite (Recommended)**
```bash
cd backend
python test_phase2.py
```
✅ Tests everything: database, queries, ML predictions with real data

### **Option 2: Interactive Testing**
```bash
cd backend
python quick_test.py
```
✅ Test any player interactively, get instant predictions

### **Option 3: View Database Contents**
```bash
cd backend
python view_database.py
```
✅ See what's in your database, sample players, recent games

### **Option 4: Django Admin Interface**
```bash
cd backend
python manage.py createsuperuser  # First time only
python manage.py runserver
# Visit: http://localhost:8000/admin
```
✅ Visual interface to browse players and game stats

### **Option 5: Django Shell (Advanced)**
```bash
cd backend
python manage.py shell
```
✅ Full Python shell access to query anything

---

## 🎯 **Detailed Testing Instructions**

### **1. Full Test Suite (`test_phase2.py`)**

**What it tests:**
- Database statistics
- Player searches
- Game history retrieval
- End-to-end ML predictions
- Multiple player positions

**Run it:**
```bash
python test_phase2.py
```

**Expected output:**
```
[PASS] Database has 8,120 players
[PASS] Found Patrick Mahomes
[PASS] Retrieved game history
[PASS] ML prediction successful!
```

---

### **2. Interactive Quick Test (`quick_test.py`)**

**What it does:**
- Shows available players
- Lets you enter any player name
- Gets their recent games
- Makes a prediction

**Run it:**
```bash
python quick_test.py
```

**Example session:**
```
Available players matching 'Mahomes':
  - Patrick Mahomes (QB, KC) - 26 games

Enter player name to test: Josh Allen

Testing: Josh Allen (QB, BUF)
Games in database: 25

Recent games:
  Week 5, 2025: 285 pass yds, 2 TDs
  Week 6, 2025: 312 pass yds, 3 TDs
  Week 7, 2025: 263 pass yds, 1 TDs

PREDICTION RESULTS
==================================================
Player: Josh Allen (QB)
Bet: OVER 250.5 Passing Yards

Predictions:
  Pessimistic (q10): 210.3
  Most Likely (q50): 233.1
  Optimistic (q90): 255.8

Win Probability: 45.2%
Recommendation: Fair Bet
==================================================
```

---

### **3. View Database (`view_database.py`)**

**What it shows:**
- Total players by position
- Sample players by team
- Players with most games
- Recent games

**Run it:**
```bash
python view_database.py
```

**Example output:**
```
DATABASE VIEWER
======================================================================

Total Players: 8,120
  QB: 990
  RB: 2,416
  WR: 3,169
  TE: 1,545

Total Game Records: 8,471
Available Seasons: [2025, 2024]

SAMPLE PLAYERS BY TEAM
----------------------------------------------------------------------

KC:
  Patrick Mahomes (QB) - 26 games
  Travis Kelce (TE) - 26 games
  Isiah Pacheco (RB) - 24 games
  ...
```

---

### **4. Django Admin Interface (Visual)**

**Setup (first time only):**
```bash
cd backend
python manage.py createsuperuser
```
Enter username, email, and password.

**Access:**
```bash
python manage.py runserver
```
Visit: **http://localhost:8000/admin**

**What you can do:**
- Browse all players
- Search by name, position, team
- View individual player stats
- See all game records
- Filter by season, week, position
- Edit data if needed

---

### **5. Django Shell (Advanced)**

**Start shell:**
```bash
python manage.py shell
```

**Common queries:**

#### Get a specific player:
```python
from api.data_access import get_player_by_name
player = get_player_by_name("Patrick Mahomes")
print(player.display_name, player.position, player.current_team)
```

#### Search for players:
```python
from api.data_access import search_players
results = search_players("Allen", position="QB")
for p in results:
    print(f"{p.display_name} - {p.current_team}")
```

#### Get player history:
```python
from api.data_access import get_player_recent_games
history = get_player_recent_games(player, num_games=5)
print(history[['week', 'season', 'passing_yards', 'passing_tds']])
```

#### Make a prediction:
```python
from ml_service import PredictionService
predictor = PredictionService()

result = predictor.predict_from_betting_scenario(
    player_name="Patrick Mahomes",
    position="QB",
    team="KC",
    action="Passing Yards",
    bet_type="over",
    action_amount=275.5,
    player_history=history,
    current_season=2025,
    current_week=8
)

print(f"q50: {result.predictions['q50']:.1f}")
print(f"Win Prob: {result.win_probability:.1%}")
```

#### Database stats:
```python
from api.data_access import get_database_stats
stats = get_database_stats()
print(stats)
```

#### Get all QBs:
```python
from api.models import Player
qbs = Player.objects.filter(position='QB').order_by('display_name')
print(f"Total QBs: {qbs.count()}")
```

---

## 🔧 **Troubleshooting**

### **"Player not found"**
- Player might not be in database (check spelling)
- Run `python view_database.py` to see available players
- Search with partial name: `search_players("Mahom")`

### **"Insufficient game history"**
- Player needs at least 3 games for predictions
- Check: `player.game_stats.count()`
- Load more data: `python manage.py load_player_data --years 2023 2024 2025`

### **"Import error"**
- Make sure you're in `backend` directory
- Make sure Django is set up: `import django; django.setup()`

### **"Module not found"**
- Install requirements: `pip install -r requirements.txt`
- Activate virtual environment first

---

## 📊 **What to Test**

### ✅ **Basic Functionality**
- [ ] Can query players by name
- [ ] Can search for players
- [ ] Can get player game history
- [ ] Player history has correct format

### ✅ **ML Integration**
- [ ] Can load ML models
- [ ] Can make predictions with real data
- [ ] Predictions return valid results
- [ ] Different positions work (QB, RB, WR, TE)

### ✅ **Data Quality**
- [ ] Players have correct positions
- [ ] Game stats have reasonable values
- [ ] Recent games show 2025 data
- [ ] Can filter by team

---

## 🎯 **Testing Checklist**

Before moving to Phase 3, verify:

1. **Run full test:** `python test_phase2.py` - All tests pass ✅
2. **Test interactive:** `python quick_test.py` - Can predict any player ✅
3. **View database:** `python view_database.py` - Data looks good ✅
4. **Test different players:** Patrick Mahomes, Josh Allen, Travis Kelce ✅
5. **Test different positions:** QB, RB, WR, TE ✅

If all checked, you're ready for **Phase 3: API Endpoints!** 🚀

---

## 📝 **Quick Test Commands**

Copy-paste these to test quickly:

```bash
# Full test
python backend/test_phase2.py

# Quick interactive test
python backend/quick_test.py

# View database
python backend/view_database.py

# Django shell
cd backend && python manage.py shell

# Admin interface
cd backend && python manage.py runserver
# Visit: http://localhost:8000/admin
```

---

## 🆘 **Need Help?**

If something's not working:

1. Check you're in the right directory (`backend/`)
2. Check database has data (`python view_database.py`)
3. Check requirements installed (`pip list | grep pandas`)
4. Check Django is working (`python manage.py check`)

All good? You're ready for Phase 3! 🎉

