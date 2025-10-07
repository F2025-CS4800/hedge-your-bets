from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
import json
from datetime import datetime
from decimal import Decimal, InvalidOperation
from .models import BettingScenario


@csrf_exempt
def hello(request):
    """Simple API endpoint that returns a greeting."""
    if request.method == "GET":
        return JsonResponse(
            {
                "message": "Hello from Django API!",
                "team": "Hedge Your Bets",
                "timestamp": datetime.now().isoformat(),
                "framework": "Django",
            }
        )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def jason_greeting(request):
    """Simple hardcoded API endpoint that returns Jason's greeting."""
    if request.method == "GET":
        return JsonResponse({"message": "hi this is not jason mar"})

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def tim_greeting(request):
    """Hardcoded API endpoint that returns Tim's greeting."""
    if request.method == "GET":
        return JsonResponse({"message": "hi this is tim o fy"})
    
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["POST"])
def create_betting_scenario(request):
    """API endpoint to create a new betting scenario."""
    try:
        # Parse JSON data from request body
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['sport', 'team', 'player', 'betType', 'action', 'actionAmount', 'betAmount']
        for field in required_fields:
            if field not in data or not data[field]:
                return JsonResponse({
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        # Validate sport choice
        valid_sports = ['football', 'basketball']
        if data['sport'] not in valid_sports:
            return JsonResponse({
                'error': f'Invalid sport. Must be one of: {", ".join(valid_sports)}'
            }, status=400)
        
        # Validate bet type
        valid_bet_types = ['over', 'under']
        if data['betType'] not in valid_bet_types:
            return JsonResponse({
                'error': f'Invalid bet type. Must be one of: {", ".join(valid_bet_types)}'
            }, status=400)
        
        # Validate action amount is a positive number and an actual number
        try:
            action_amount = Decimal(str(data['actionAmount']))
            if action_amount <= 0:
                return JsonResponse({
                    'error': 'Action amount must be greater than 0'
                }, status=400)
        except (ValueError, TypeError, InvalidOperation):
            return JsonResponse({
                'error': 'Action amount must be a valid number'
            }, status=400)
        
        # Validate bet amount is a positive number and an actual number
        try:
            bet_amount = Decimal(str(data['betAmount']))
            if bet_amount <= 0:
                return JsonResponse({
                    'error': 'Bet amount must be greater than 0'
                }, status=400)
        except (ValueError, TypeError, InvalidOperation) as e:
            return JsonResponse({
                'error': 'Bet amount must be a valid number'
            }, status=400)
        
        # Create betting scenario
        scenario = BettingScenario.objects.create(
            sport=data['sport'],
            team=data['team'],
            player=data['player'],
            bet_type=data['betType'],
            action=data['action'],
            action_amount=action_amount,
            bet_amount=bet_amount
        )
        
        # Return success response with created scenario data
        return JsonResponse({
            'success': True,
            'message': 'Betting scenario created successfully!',
            'data': {
                'id': scenario.id,
                'sport': scenario.sport,
                'team': scenario.team,
                'player': scenario.player,
                'bet_type': scenario.bet_type,
                'action': scenario.action,
                'action_amount': str(scenario.action_amount),
                'bet_amount': str(scenario.bet_amount),
                'created_at': scenario.created_at.isoformat(),
                'is_processed': scenario.is_processed
            }
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'Server error: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_betting_scenarios(request):
    """API endpoint to retrieve all betting scenarios."""
    try:
        scenarios = BettingScenario.objects.all()[:50]  # Limit to 50 most recent
        
        scenarios_data = []
        for scenario in scenarios:
            scenarios_data.append({
                'id': scenario.id,
                'sport': scenario.sport,
                'team': scenario.team,
                'player': scenario.player,
                'bet_type': scenario.bet_type,
                'action': scenario.action,
                'action_amount': str(scenario.action_amount),
                'bet_amount': str(scenario.bet_amount),
                'created_at': scenario.created_at.isoformat(),
                'is_processed': scenario.is_processed,
                'prediction_score': scenario.prediction_score,
                'confidence_level': scenario.confidence_level
            })
        
        return JsonResponse({
            'success': True,
            'count': len(scenarios_data),
            'scenarios': scenarios_data
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Server error: {str(e)}'
        }, status=500)
