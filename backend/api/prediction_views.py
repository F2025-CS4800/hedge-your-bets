"""
API views for ML predictions.
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import sys
from decimal import Decimal, InvalidOperation

# Import ML service
sys.path.insert(0, 'ml_service')
from ml_service import PredictionService

# Import data access functions
from .data_access import (
    get_player_by_name,
    get_player_recent_games,
    search_players,
    get_available_seasons
)
from .models import BettingScenario, PlayerGameStats
from .constants import standardize_team_name


# Initialize prediction service
predictor = PredictionService()


@csrf_exempt
@require_http_methods(["GET"])
def get_all_teams(request):
    """
    API endpoint to get all available teams.
    
    Response:
    {
        "success": true,
        "teams": [
            {"abbr": "KC", "name": "Kansas City Chiefs"},
            ...
        ]
    }
    """
    try:
        from .models import Player
        from .constants import TEAM_ABBREVIATIONS
        
        # Get unique teams from database
        teams_in_db = Player.objects.values_list('current_team', flat=True).distinct()
        teams_in_db = set([t for t in teams_in_db if t])  # Convert to set for uniqueness and filter None/empty
        
        # Format with full names
        teams_data = [
            {
                'abbr': team_abbr,
                'name': TEAM_ABBREVIATIONS.get(team_abbr, team_abbr)
            }
            for team_abbr in sorted(teams_in_db)
        ]
        
        return JsonResponse({
            'success': True,
            'count': len(teams_data),
            'teams': teams_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_players_by_team(request):
    """
    API endpoint to get players for a specific team.
    
    Query params:
        team: Team abbreviation (e.g., "KC") or full name
        position: Optional position filter (QB, RB, WR, TE)
    
    Response:
    {
        "success": true,
        "team": "KC",
        "players": [
            {"id": "00-0033873", "name": "Patrick Mahomes", "position": "QB"},
            ...
        ]
    }
    """
    try:
        team = request.GET.get('team')
        position = request.GET.get('position')
        
        if not team:
            return JsonResponse({
                'success': False,
                'error': 'Missing required parameter: team'
            }, status=400)
        
        # Standardize team name
        team_abbr = standardize_team_name(team)
        
        # Get players
        from .data_access import get_players_by_team
        players = get_players_by_team(team_abbr, position=position)
        
        # Format response
        players_data = [
            {
                'id': p.player_id,
                'name': p.display_name,
                'position': p.position,
                'jersey_number': p.jersey_number
            }
            for p in players
        ]
        
        return JsonResponse({
            'success': True,
            'team': team_abbr,
            'count': len(players_data),
            'players': players_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def predict_bet(request):
    """
    API endpoint to make a betting prediction.
    
    Request body:
    {
        "player": "Patrick Mahomes",
        "action": "Passing Yards",
        "bet_type": "over",
        "action_amount": 275.5,
        "bet_amount": 100.00,
        "team": "Kansas City Chiefs"  // Optional, will use DB team
    }
    
    Response:
    {
        "success": true,
        "scenario_id": 123,
        "player": {...},
        "bet": {...},
        "prediction": {...},
        "analysis": {...},
        "details": {...}
    }
    """
    try:
        # Parse JSON data
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['player', 'action', 'bet_type', 'action_amount']
        for field in required_fields:
            if field not in data or data[field] in [None, '']:
                return JsonResponse({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        player_name = data['player']
        action = data['action']
        bet_type = data['bet_type'].lower()
        
        # Validate bet type
        if bet_type not in ['over', 'under']:
            return JsonResponse({
                'success': False,
                'error': f'Invalid bet_type: {bet_type}. Must be "over" or "under"'
            }, status=400)
        
        # Validate and parse amounts
        try:
            action_amount = float(data['action_amount'])
            if action_amount <= 0:
                return JsonResponse({
                    'success': False,
                    'error': 'action_amount must be greater than 0'
                }, status=400)
        except (ValueError, TypeError):
            return JsonResponse({
                'success': False,
                'error': 'action_amount must be a valid number'
            }, status=400)
        
        bet_amount = 0.0
        if 'bet_amount' in data:
            try:
                bet_amount = float(data['bet_amount'])
            except (ValueError, TypeError):
                bet_amount = 0.0
        
        # Look up player in database
        player = get_player_by_name(player_name)
        
        if not player:
            # Player not found - provide suggestions
            suggestions = search_players(player_name, limit=5)
            suggestion_names = [p.display_name for p in suggestions]
            
            return JsonResponse({
                'success': False,
                'error': f'Player "{player_name}" not found in database',
                'suggestions': suggestion_names
            }, status=404)
        
        # Get player info
        position = player.position
        team = player.current_team or 'FA'
        
        # Auto-detect current week from database
        try:
            latest_game = PlayerGameStats.objects.filter(
                season_type='REG'
            ).order_by('-season', '-week').first()
            
            if latest_game:
                current_season = latest_game.season
                current_week = latest_game.week + 1  # Predict for NEXT week
            else:
                # Fallback
                current_season = 2025
                current_week = 8
        except Exception:
            current_season = 2025
            current_week = 8
        
        # Get player history
        try:
            player_history = get_player_recent_games(player, num_games=8)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Error retrieving player history: {str(e)}'
            }, status=500)
        
        # Check if sufficient history
        has_warning = False
        warning_message = None
        
        if len(player_history) < 3:
            has_warning = True
            warning_message = (
                f"Limited data available. Only {len(player_history)} games found. "
                f"Predictions may be less accurate."
            )
        
        # Make prediction
        try:
            result = predictor.predict_from_betting_scenario(
                player_name=player.display_name,
                position=position,
                team=team,
                action=action,
                bet_type=bet_type,
                action_amount=action_amount,
                player_history=player_history,
                current_season=current_season,
                current_week=current_week,
                is_playoff=False
            )
        except ValueError as e:
            # Stat doesn't match position or other validation error
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Prediction error: {str(e)}'
            }, status=500)
        
        # Save to database
        try:
            scenario = BettingScenario.objects.create(
                sport='football',
                team=team,
                player=player.display_name,
                bet_type=bet_type,
                action=action,
                action_amount=Decimal(str(action_amount)),
                bet_amount=Decimal(str(bet_amount)),
                
                # Mark as processed
                is_processed=True,
                
                # Store predictions
                prediction_q10=result.predictions.get('q10'),
                prediction_q50=result.predictions.get('q50'),
                prediction_q90=result.predictions.get('q90'),
                
                # Store analysis
                win_probability=result.win_probability,
                confidence_level=result.confidence_level,
                expected_value=result.expected_value,
                recommendation=result.recommendation,
                
                # Store metadata
                player_position=position,
                games_analyzed=len(player_history),
                prediction_season=current_season,
                prediction_week=current_week,
                
                # Store warning if any
                has_warning=has_warning,
                warning_message=warning_message
            )
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': f'Error saving scenario: {str(e)}'
            }, status=500)
        
        # Build response
        response = {
            'success': True,
            'scenario_id': scenario.id,
            
            'player': {
                'name': player.display_name,
                'position': position,
                'team': team
            },
            
            'bet': {
                'action': action,
                'type': bet_type,
                'threshold': action_amount,
                'amount': float(bet_amount)
            },
            
            'prediction': {
                'q10': result.predictions.get('q10'),
                'q50': result.predictions.get('q50'),
                'q90': result.predictions.get('q90')
            },
            
            'analysis': {
                'win_probability': result.win_probability,
                'confidence_level': result.confidence_level,
                'expected_value': result.expected_value,
                'recommendation': result.recommendation
            },
            
            'details': {
                'games_analyzed': len(player_history),
                'current_season': current_season,
                'current_week': current_week,
                'stat_display_name': result.stat_display_name,
                'stat_unit': result.details.get('stat_unit', '')
            }
        }
        
        # Add warning if present
        if has_warning:
            response['warning'] = warning_message
        
        return JsonResponse(response, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        # Catch-all for unexpected errors
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)

