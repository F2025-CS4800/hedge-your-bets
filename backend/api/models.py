from django.db import models
from django.utils import timezone


class BettingScenario(models.Model):
    """Model to store betting scenario data from users."""
    
    SPORT_CHOICES = [
        ('basketball', 'Basketball'),
        ('football', 'Football'),
    ]
    
    BET_TYPE_CHOICES = [
        ('over', 'Over'),
        ('under', 'Under'),
    ]
    
    sport = models.CharField(
        max_length=20,
        choices=SPORT_CHOICES,
        default='football',
        help_text="The sport for the betting scenario"
    )
    
    team = models.CharField(
        max_length=100,
        help_text="The team name"
    )
    
    player = models.CharField(
        max_length=100,
        help_text="The player name"
    )
    
    bet_type = models.CharField(
        max_length=10,
        choices=BET_TYPE_CHOICES,
        help_text="Whether the bet is over or under"
    )
    
    action = models.CharField(
        max_length=50,
        help_text="The action being bet on (e.g., Passing Yards)"
    )
    
    action_amount = models.DecimalField(
        max_digits=10,
        decimal_places=1,
        help_text="The threshold amount for the action"
    )
    
    bet_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="The bet amount in dollars"
    )
    
    created_at = models.DateTimeField(
        default=timezone.now,
        help_text="When the betting scenario was created"
    )
    
    # Optional fields for future ML model integration
    prediction_score = models.FloatField(
        null=True,
        blank=True,
        help_text="ML model prediction score (0-1)"
    )
    
    confidence_level = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        help_text="Confidence level (Low, Medium, High)"
    )
    
    is_processed = models.BooleanField(
        default=False,
        help_text="Whether the scenario has been processed by ML model"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Betting Scenario"
        verbose_name_plural = "Betting Scenarios"
    
    def __str__(self):
        return f"{self.player} ({self.team}) - {self.action} {self.bet_type} {self.action_amount}"
