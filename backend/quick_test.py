"""
Quick test script - test any player prediction
Usage: python quick_test.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hedge_bets.settings')
django.setup()

from api.data_access import get_player_by_name, get_player_recent_games, search_players
import sys
sys.path.insert(0, 'ml_service')
from ml_service import PredictionService

# Search for players
print("Available players matching 'Mahomes':")
results = search_players("Mahomes")
for p in results:
    game_count = p.game_stats.count()
    print(f"  - {p.display_name} ({p.position}, {p.current_team}) - {game_count} games")

print("\nAvailable players matching 'Allen':")
results = search_players("Allen", position="QB")
for p in results:
    game_count = p.game_stats.count()
    print(f"  - {p.display_name} ({p.position}, {p.current_team}) - {game_count} games")

# Test a prediction
print("\n" + "="*70)
player_name = input("Enter player name to test (or press Enter for Patrick Mahomes): ").strip()
if not player_name:
    player_name = "Patrick Mahomes"

player = get_player_by_name(player_name)

if not player:
    print(f"Player '{player_name}' not found!")
    exit(1)

print(f"\nTesting: {player.display_name} ({player.position}, {player.current_team})")
print(f"Games in database: {player.game_stats.count()}")

# Get history
history_df = get_player_recent_games(player, num_games=8)
print(f"Retrieved {len(history_df)} games for prediction")

if len(history_df) < 3:
    print("ERROR: Not enough game history for prediction!")
    exit(1)

# Show recent performance
print("\nRecent games:")
for idx, row in history_df.tail(3).iterrows():
    if player.position == 'QB':
        print(f"  Week {row['week']}, {row['season']}: {row['passing_yards']} pass yds, {row['passing_tds']} TDs")
    elif player.position == 'RB':
        print(f"  Week {row['week']}, {row['season']}: {row['rushing_yards']} rush yds, {row['receptions']} rec")
    elif player.position in ['WR', 'TE']:
        print(f"  Week {row['week']}, {row['season']}: {row['receiving_yards']} rec yds, {row['receptions']} rec")

# Make prediction
predictor = PredictionService()

# Default actions by position
action_map = {
    'QB': ('Passing Yards', 250.5),
    'RB': ('Rushing Yards', 75.5),
    'WR': ('Receiving Yards', 65.5),
    'TE': ('Receptions', 4.5),
}

action, threshold = action_map[player.position]

print(f"\nMaking prediction: {action} OVER {threshold}")

try:
    result = predictor.predict_from_betting_scenario(
        player_name=player.display_name,
        position=player.position,
        team=player.current_team or "UNK",
        action=action,
        bet_type='over',
        action_amount=threshold,
        player_history=history_df,
        current_season=2025,
        current_week=8
    )
    
    print("\n" + "="*70)
    print("PREDICTION RESULTS")
    print("="*70)
    print(f"Player: {player.display_name} ({player.position})")
    print(f"Bet: OVER {threshold} {action}")
    print(f"\nPredictions:")
    print(f"  Pessimistic (q10): {result.predictions['q10']:.1f}")
    print(f"  Most Likely (q50): {result.predictions['q50']:.1f}")
    print(f"  Optimistic (q90):  {result.predictions['q90']:.1f}")
    print(f"\nWin Probability: {result.win_probability:.1%}")
    print(f"Confidence: {result.confidence_level}")
    print(f"Recommendation: {result.recommendation}")
    print("="*70)

except Exception as e:
    print(f"\nERROR making prediction: {e}")
    import traceback
    traceback.print_exc()

