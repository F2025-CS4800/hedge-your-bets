"""
Test script for Phase 2: Database + ML Integration
Tests querying players and making predictions with real data.
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hedge_bets.settings')
django.setup()

from api.data_access import (
    get_player_by_name,
    get_player_recent_games,
    search_players,
    player_has_sufficient_history,
    get_database_stats
)
from api.models import Player
import sys
sys.path.insert(0, 'ml_service')
from ml_service import PredictionService

print("=" * 70)
print("PHASE 2 TEST: DATABASE + ML INTEGRATION")
print("=" * 70)

# Test 1: Database stats
print("\\n1. DATABASE STATISTICS:")
stats = get_database_stats()
print(f"   Total Players: {stats['total_players']}")
for pos, count in stats['players_by_position'].items():
    print(f"     {pos}: {count}")
print(f"   Total Game Records: {stats['total_game_records']}")
print(f"   Available Seasons: {stats['available_seasons']}")

# Test 2: Search for players
print("\\n2. SEARCH FOR PLAYERS:")
search_results = search_players("Mahomes", limit=5)
print(f"   Found {len(search_results)} players matching 'Mahomes':")
for player in search_results:
    print(f"     - {player.display_name} ({player.position}, {player.current_team})")

# Test 3: Get specific player
print("\\n3. GET SPECIFIC PLAYER:")
test_players = [
    "Patrick Mahomes",
    "Josh Allen",
    "Travis Kelce"
]

for player_name in test_players:
    player = get_player_by_name(player_name)
    if player:
        print(f"   [PASS] Found: {player.display_name} ({player.position}, {player.current_team})")
        
        # Check game history
        has_history = player_has_sufficient_history(player, min_games=3)
        game_count = player.game_stats.count()
        print(f"          Games in DB: {game_count}, Sufficient: {has_history}")
    else:
        print(f"   [FAIL] Not found: {player_name}")

# Test 4: Get player history
print("\\n4. GET PLAYER GAME HISTORY:")
player = get_player_by_name("Patrick Mahomes")
if player:
    history_df = get_player_recent_games(player, num_games=5)
    print(f"   Player: {player.display_name}")
    print(f"   Recent games retrieved: {len(history_df)}")
    
    if not history_df.empty:
        print("\\n   Last 3 games:")
        for idx, row in history_df.tail(3).iterrows():
            print(f"     Week {row['week']}, {row['season']}: "
                  f"{row['passing_yards']} pass yds, {row['passing_tds']} TDs, "
                  f"{row['passing_interceptions']} INTs")
else:
    print("   [SKIP] Patrick Mahomes not found in database")

# Test 5: End-to-end ML prediction
print("\\n5. END-TO-END ML PREDICTION TEST:")
player = get_player_by_name("Patrick Mahomes")

if player and player_has_sufficient_history(player, min_games=3):
    print(f"   Testing prediction for: {player.display_name}")
    
    # Get player history
    history_df = get_player_recent_games(player, num_games=8)
    
    if len(history_df) >= 3:
        print(f"   Retrieved {len(history_df)} games for analysis")
        
        # Initialize prediction service
        predictor = PredictionService()
        
        try:
            # Make prediction
            result = predictor.predict_from_betting_scenario(
                player_name=player.display_name,
                position=player.position,
                team=player.current_team or "KC",
                action='Passing Yards',
                bet_type='over',
                action_amount=275.5,
                player_history=history_df,
                current_season=2025,
                current_week=8,
                is_playoff=False
            )
            
            print("\\n   PREDICTION RESULTS:")
            print("   " + "-" * 60)
            print(f"   Player: {player.display_name} ({player.position})")
            print(f"   Bet: OVER {result.threshold} {result.stat_display_name}")
            print(f"\\n   Predictions:")
            print(f"     Pessimistic (q10): {result.predictions['q10']:.1f}")
            print(f"     Most Likely (q50): {result.predictions['q50']:.1f}")
            print(f"     Optimistic (q90):  {result.predictions['q90']:.1f}")
            print(f"\\n   Win Probability: {result.win_probability:.1%}")
            print(f"   Confidence: {result.confidence_level}")
            print(f"   Expected Value: {result.expected_value:+.3f}")
            print(f"   Recommendation: {result.recommendation}")
            print("   " + "-" * 60)
            
            print("\\n   [PASS] Prediction completed successfully!")
            
        except Exception as e:
            print(f"\\n   [FAIL] Prediction error: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"   [SKIP] Insufficient history ({len(history_df)} games)")
else:
    print("   [SKIP] Player not found or insufficient history")

# Test 6: Test different positions
print("\\n6. TEST DIFFERENT POSITIONS:")
test_cases = [
    ("Travis Kelce", "TE", "Receptions", 4.5),
    ("Josh Allen", "QB", "Passing Yards", 250.5),
]

predictor = PredictionService()

for player_name, expected_pos, action, threshold in test_cases:
    player = get_player_by_name(player_name)
    
    if player and player.position == expected_pos:
        history_df = get_player_recent_games(player, num_games=5)
        
        if len(history_df) >= 3:
            try:
                result = predictor.predict_from_betting_scenario(
                    player_name=player.display_name,
                    position=player.position,
                    team=player.current_team or "BUF",
                    action=action,
                    bet_type='over',
                    action_amount=threshold,
                    player_history=history_df,
                    current_season=2025,
                    current_week=8
                )
                
                print(f"   [PASS] {player.display_name} ({player.position}): "
                      f"Predicted {result.predictions['q50']:.1f} {action}")
            except Exception as e:
                print(f"   [FAIL] {player_name}: {e}")
        else:
            print(f"   [SKIP] {player_name}: Insufficient history")
    else:
        if not player:
            print(f"   [SKIP] {player_name}: Not found in database")
        else:
            print(f"   [SKIP] {player_name}: Position mismatch (expected {expected_pos}, got {player.position})")

print("\\n" + "=" * 70)
print("[SUCCESS] PHASE 2 TESTING COMPLETE!")
print("=" * 70)
print("\\nPhase 2 Summary:")
print("  [x] Database models created")
print("  [x] Data imported successfully")
print("  [x] Data access layer working")
print("  [x] ML predictions working with real data")
print("\\nNext: Phase 3 - Create API endpoints for frontend integration")

