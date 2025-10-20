'use client';

import { useState, useEffect } from "react";
import SignInButton from "./SignInButton";
import { predictBet, getPlayersByTeam, getAllTeams } from "../lib/api.js";

export default function BettingForm({ session }) {
  // If no session, show sign-in component
  if (!session) {
    return <SignInButton />;
  }

  const [formData, setFormData] = useState({
    sport: "football",
    team: "",
    player: "",
    betType: "",
    action: "",
    actionAmount: "",
    betAmount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  
  // Dynamic team and player loading
  const [availableTeams, setAvailableTeams] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  // Load teams on component mount
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const result = await getAllTeams();
      if (result.success) {
        setAvailableTeams(result.teams);
      }
    } catch (err) {
      console.error('Error loading teams:', err);
    } finally {
      setLoadingTeams(false);
    }
  };

  // Football action options
  const actionOptions = [
    "Passing Yards",
    "Rushing Yards", 
    "Receiving Yards",
    "Receptions",
    "Touchdowns",
    "Completions",
    "Interceptions",
  ];

  // Load players when team changes
  useEffect(() => {
    if (formData.team) {
      loadPlayersForTeam(formData.team);
    } else {
      setAvailablePlayers([]);
    }
  }, [formData.team]);

  const loadPlayersForTeam = async (teamAbbr) => {
    setLoadingPlayers(true);
    try {
      const result = await getPlayersByTeam(teamAbbr);
      
      if (result.success) {
        setAvailablePlayers(result.players);
      } else {
        setAvailablePlayers([]);
        console.error('Failed to load players:', result.error);
      }
    } catch (err) {
      console.error('Error loading players:', err);
      setAvailablePlayers([]);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear results when form changes
    if (predictionResult) {
      setPredictionResult(null);
      setError(null);
      setWarning(null);
    }

    // Handle cascading dropdowns
    if (name === "team") {
      setFormData((prev) => ({
        ...prev,
        team: value,
        player: "", // Reset player when team changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setWarning(null);
    setPredictionResult(null);

    try {
      // Call backend API for prediction
      const result = await predictBet({
        player: formData.player,
        action: formData.action,
        bet_type: formData.betType,
        action_amount: parseFloat(formData.actionAmount),
        bet_amount: parseFloat(formData.betAmount) || 0,
      });

      // Check for warnings
      if (result.warning) {
        setWarning(result.warning);
      }

      // Set prediction result
      setPredictionResult(result);

    } catch (err) {
      setError({
        message: err.message || "Error creating betting scenario. Please try again.",
        suggestions: err.suggestions || []
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setWarning(null);
    setPredictionResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Create New Betting Scenario
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Enter your betting details below and let our AI analyze the potential value of your bet.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sport - Fixed to Football */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sport
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600 italic">
                Football
              </div>
            </div>

            {/* Team Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team *
              </label>
              <select
                name="team"
                value={formData.team}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                required
                disabled={loadingTeams}
              >
                <option value="">
                  {loadingTeams ? "Loading teams..." : "Select Team"}
                </option>
                {availableTeams.map((team) => (
                  <option key={team.abbr} value={team.abbr}>
                    {team.name}
                  </option>
                ))}
              </select>
              {loadingTeams && (
                <p className="text-sm text-blue-600 mt-1 italic">
                  Loading teams from database...
                </p>
              )}
            </div>

            {/* Player Selection - dynamic from database */}
            {formData.team && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Player *
                </label>
                <select
                  name="player"
                  value={formData.player}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  required
                  disabled={loadingPlayers}
                >
                  <option value="">
                    {loadingPlayers ? "Loading players..." : "Select Player"}
                  </option>
                  {availablePlayers.map((player) => (
                    <option key={player.id} value={player.name}>
                      {player.name} ({player.position})
                    </option>
                  ))}
                </select>
                {loadingPlayers && (
                  <p className="text-sm text-blue-600 mt-1 italic">
                    Loading players from database...
                  </p>
                )}
              </div>
            )}

            {/* Bet Type and Action in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bet Type *
                </label>
                <select
                  name="betType"
                  value={formData.betType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  required
                >
                  <option value="">Select Over or Under</option>
                  <option value="over">Over</option>
                  <option value="under">Under</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Action *
                </label>
                <select
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  required
                >
                  <option value="">Select Action</option>
                  {actionOptions.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount fields in a row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Action Amount *
                </label>
                <input
                  type="number"
                  name="actionAmount"
                  value={formData.actionAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 250 for passing yards"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  required
                />
                <p className="text-sm text-gray-500 mt-1 italic">
                  Enter the threshold number for your action
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bet Amount ($) *
                </label>
                <input
                  type="number"
                  name="betAmount"
                  value={formData.betAmount}
                  onChange={handleInputChange}
                  placeholder="100"
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  required
                />
                <p className="text-sm text-gray-500 mt-1 italic">
                  How much money you want to wager
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
              } text-white`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Your Bet...
                </span>
              ) : (
                "Analyze Bet"
              )}
            </button>
            
            {isSubmitting && (
              <p className="text-center text-gray-600 mt-2 text-sm italic">
                Please wait while we analyze player statistics...
              </p>
            )}
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-6 rounded-xl bg-red-50 border-2 border-red-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-red-900">Error</h3>
                  <p className="mt-1 text-red-800">{error.message}</p>
                  
                  {error.suggestions && error.suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-red-900">Did you mean:</p>
                      <ul className="mt-2 space-y-1">
                        {error.suggestions.map((suggestion, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => {
                                setFormData(prev => ({ ...prev, player: suggestion }));
                                setError(null);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              {suggestion}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button
                    onClick={handleRetry}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Warning Display */}
          {warning && (
            <div className="mt-6 p-6 rounded-xl bg-yellow-50 border-2 border-yellow-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-yellow-900">Warning</h3>
                  <p className="mt-1 text-yellow-800">{warning}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prediction Results */}
          {predictionResult && (
            <div className="mt-8">
              {/* Results Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-xl">
                <h3 className="text-2xl font-bold">Prediction Results</h3>
                <p className="text-blue-100 mt-1">AI-Powered Betting Analysis</p>
              </div>

              {/* Results Content */}
              <div className="bg-white border-2 border-gray-200 rounded-b-xl p-6 space-y-6">
                {/* Player Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Bet Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Player:</span>
                      <span className="ml-2 font-medium">{predictionResult.player.name} ({predictionResult.player.position})</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Team:</span>
                      <span className="ml-2 font-medium">{predictionResult.player.team}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Stat:</span>
                      <span className="ml-2 font-medium">{predictionResult.bet.action}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Bet:</span>
                      <span className="ml-2 font-medium">{predictionResult.bet.type.toUpperCase()} {predictionResult.bet.threshold}</span>
                    </div>
                  </div>
                </div>

                {/* Predictions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Predicted Performance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <p className="text-xs text-red-600 font-medium uppercase mb-1">Pessimistic</p>
                      <p className="text-2xl font-bold text-red-900">{predictionResult.prediction.q10?.toFixed(1)}</p>
                      <p className="text-xs text-red-600 mt-1">10th Percentile</p>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 text-center">
                      <p className="text-xs text-blue-600 font-medium uppercase mb-1">Most Likely</p>
                      <p className="text-3xl font-bold text-blue-900">{predictionResult.prediction.q50?.toFixed(1)}</p>
                      <p className="text-xs text-blue-600 mt-1">50th Percentile</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <p className="text-xs text-green-600 font-medium uppercase mb-1">Optimistic</p>
                      <p className="text-2xl font-bold text-green-900">{predictionResult.prediction.q90?.toFixed(1)}</p>
                      <p className="text-xs text-green-600 mt-1">90th Percentile</p>
                    </div>
                  </div>
                </div>

                {/* Win Probability */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Win Probability</h4>
                    <span className={`text-3xl font-bold ${
                      predictionResult.analysis.win_probability >= 0.6 ? 'text-green-600' :
                      predictionResult.analysis.win_probability >= 0.4 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {(predictionResult.analysis.win_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        predictionResult.analysis.win_probability >= 0.6 ? 'bg-green-500' :
                        predictionResult.analysis.win_probability >= 0.4 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${predictionResult.analysis.win_probability * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-xl p-6 border-2 ${
                  predictionResult.analysis.recommendation === 'Good Bet' ? 'bg-green-50 border-green-300' :
                  predictionResult.analysis.recommendation === 'Fair Bet' ? 'bg-yellow-50 border-yellow-300' :
                  'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Recommendation</h4>
                      <p className={`text-2xl font-bold ${
                        predictionResult.analysis.recommendation === 'Good Bet' ? 'text-green-700' :
                        predictionResult.analysis.recommendation === 'Fair Bet' ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {predictionResult.analysis.recommendation}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Confidence: <span className="font-medium">{predictionResult.analysis.confidence_level}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Expected Value: <span className="font-medium">{predictionResult.analysis.expected_value?.toFixed(3)}</span>
                      </p>
                    </div>
                    <div className="text-6xl">
                      {predictionResult.analysis.recommendation === 'Good Bet' ? '✅' :
                       predictionResult.analysis.recommendation === 'Fair Bet' ? '⚠️' :
                       '❌'}
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="text-xs text-gray-500 border-t pt-4">
                  <p>Analysis based on {predictionResult.details.games_analyzed} recent games</p>
                  <p>Prediction for Week {predictionResult.details.current_week}, {predictionResult.details.current_season}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}