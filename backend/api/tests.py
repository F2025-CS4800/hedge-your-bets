"""
Unit test for the BettingScenario API endpoint.
Tests if JSON data is submitted and processed properly.
"""

import json
from decimal import Decimal
from django.test import TestCase, Client
from django.urls import reverse
from .models import BettingScenario


class BettingScenarioAPITest(TestCase):
    """Test case for betting scenario JSON data submission."""
    
    def test_json_data_submission_and_processing(self):
        """Test that valid JSON data is submitted and processed correctly."""
        # Set up test data
        client = Client()
        url = reverse('create_betting_scenario')
        
        # Valid betting scenario data (matches frontend form structure)
        betting_data = {
            'sport': 'football',
            'team': 'Kansas City Chiefs',
            'player': 'Patrick Mahomes',
            'betType': 'over',
            'action': 'Passing Yards',
            'actionAmount': '250',
            'betAmount': '100'
        }
        
        # Submit JSON data via POST request
        response = client.post(
            url,
            data=json.dumps(betting_data),
            content_type='application/json'
        )
        
        # Verify successful submission (HTTP 201 Created)
        self.assertEqual(response.status_code, 201)
        
        # Verify response contains success message
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Betting scenario created successfully!')
        
        # Verify data was saved to database
        self.assertEqual(BettingScenario.objects.count(), 1)
        
        # Verify all submitted data was correctly stored
        scenario = BettingScenario.objects.first()
        self.assertEqual(scenario.sport, 'football')
        self.assertEqual(scenario.team, 'Kansas City Chiefs')
        self.assertEqual(scenario.player, 'Patrick Mahomes')
        self.assertEqual(scenario.bet_type, 'over')
        self.assertEqual(scenario.action, 'Passing Yards')
        self.assertEqual(scenario.action_amount, Decimal('250'))
        self.assertEqual(scenario.bet_amount, Decimal('100'))
        
        # Verify response data structure matches submitted data
        returned_data = response_data['data']
        self.assertEqual(returned_data['sport'], betting_data['sport'])
        self.assertEqual(returned_data['team'], betting_data['team'])
        self.assertEqual(returned_data['player'], betting_data['player'])
        self.assertEqual(returned_data['bet_type'], betting_data['betType'])
        self.assertEqual(returned_data['action'], betting_data['action'])
        self.assertEqual(returned_data['action_amount'], betting_data['actionAmount'])
        self.assertEqual(returned_data['bet_amount'], betting_data['betAmount'])

    #Test invalid json format
    def test_invalid_json_format(self):
        client = Client()
        url = reverse('create_betting_scenario')
        
        response = client.post(
            url,
            data='{"invalid": json}',  # Malformed JSON
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertIn('Invalid JSON format', response_data['error'])

    #Test errors are produced for missing fields
    def test_missing_required_fields(self):
        """Test that missing required fields return validation errors."""
        client = Client()
        url = reverse('create_betting_scenario')
        
        incomplete_data = {
            'sport': 'football',
            'team': 'Kansas City Chiefs'
            # Missing other required fields
        }
        
        response = client.post(
            url,
            data=json.dumps(incomplete_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertIn('Missing required field', response_data['error'])
