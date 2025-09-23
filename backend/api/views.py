from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime


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
