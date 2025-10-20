# Interactive Testing Guide for Phase 2

## Open Django Shell
```bash
cd backend
python manage.py shell
```

## Basic Queries

### 1. Import models and functions
```python
from api.models import Player, PlayerGameStats
from api.data_access import *
from ml_service import PredictionService
```

### 2. Query players
```python
# Get all QBs
qbs = Player.objects.filter(position='QB')
print(f"Total QBs: {qbs.count()}")

# Search for a specific player
player = get_player_by_name("Patrick Mahomes")
print(player)

# Search with fuzzy matching
results = search_players("Allen", position="QB")
for p in results:
    print(f"{p.display_name} - {p.current_team}")
```

### 3. Check player stats
```python
player = get_player_by_name("Patrick Mahomes")

# Get total games
total_games = player.game_stats.count()
print(f"Total games: {total_games}")

# Get recent games
recent = player.game_stats.order_by('-season', '-week')[:5]
for game in recent:
    print(f"Week {game.week}, {game.season}: {game.passing_yards} yards, {game.passing_tds} TDs")

# Get specific season
season_2025 = player.game_stats.filter(season=2025)
print(f"2025 games: {season_2025.count()}")
```

### 4. Get player history for ML
```python
player = get_player_by_name("Josh Allen")
history_df = get_player_recent_games(player, num_games=5)
print(history_df)
print(f"\nColumns: {list(history_df.columns)}")
```

### 5. Make a prediction
```python
from ml_service import PredictionService

player = get_player_by_name("Travis Kelce")
history_df = get_player_recent_games(player, num_games=8)

predictor = PredictionService()
result = predictor.predict_from_betting_scenario(
    player_name="Travis Kelce",
    position="TE",
    team="KC",
    action="Receptions",
    bet_type="over",
    action_amount=4.5,
    player_history=history_df,
    current_season=2025,
    current_week=8
)

print(f"Predictions: q10={result.predictions['q10']:.1f}, "
      f"q50={result.predictions['q50']:.1f}, q90={result.predictions['q90']:.1f}")
print(f"Win Probability: {result.win_probability:.1%}")
print(f"Recommendation: {result.recommendation}")
```

### 6. Database stats
```python
stats = get_database_stats()
print(stats)
```

### 7. Team queries
```python
# Get all Chiefs players
chiefs_players = get_players_by_team("KC")
print(f"Kansas City Chiefs players: {len(chiefs_players)}")

for player in chiefs_players[:5]:
    print(f"  {player.display_name} - {player.position}")
```

## Exit Shell
```python
exit()
```

