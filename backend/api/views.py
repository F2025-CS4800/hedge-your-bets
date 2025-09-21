from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime


@csrf_exempt
def hello(request):
    """Simple API endpoint that returns a greeting."""
    if request.method == 'GET':
        return JsonResponse({
            'message': 'Hello from Django API!',
            'team': 'Hedge Your Bets',
            'timestamp': datetime.now().isoformat(),
            'framework': 'Django'
        })
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
