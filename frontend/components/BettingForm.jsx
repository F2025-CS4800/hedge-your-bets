'use client';

import React, { useState, useEffect } from "react";
import PredictionResults from "./PredictionResults";
import SignInButton from "./SignInButton";

export default function BettingForm({ session }) {
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
  const [submissionResult, setSubmissionResult] = useState(null);
  
  // Dynamic data state
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState({
    teams: false,
    players: false,
    actions: false
  });

  // Load teams on component mount
  useEffect(() => {
    loadTeams();
  }, []);

  // Load players when team changes
  useEffect(() => {
    if (formData.team) {
      loadPlayers(formData.team);
    } else {
      setPlayers([]);
      setFormData(prev => ({ ...prev, player: "", action: "" }));
    }
  }, [formData.team]);

  // Load actions when player changes
  useEffect(() => {
    if (formData.player) {
      const selectedPlayer = players.find(p => p.name === formData.player);
      if (selectedPlayer) {
        loadActions(selectedPlayer.position);
      }
    } else {
      setActions([]);
      setFormData(prev => ({ ...prev, action: "" }));
    }
  }, [formData.player, players]);

  const loadTeams = async () => {
    setLoading(prev => ({ ...prev, teams: true }));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Loading teams from:', `${apiUrl}/api/teams/`);
      
      const response = await fetch(`${apiUrl}/api/teams/`);
      console.log('Teams response status:', response.status);
      
      const data = await response.json();
      console.log('Teams response data:', data);
      
      if (data.success) {
        setTeams(data.teams);
        console.log('Teams loaded successfully:', data.teams.length);
      } else {
        console.error('Teams API returned error:', data.error);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(prev => ({ ...prev, teams: false }));
    }
  };

  const loadPlayers = async (team) => {
    setLoading(prev => ({ ...prev, players: true }));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Loading players for team:', team, 'from:', `${apiUrl}/api/players/?team=${team}`);
      
      const response = await fetch(`${apiUrl}/api/players/?team=${team}`);
      console.log('Players response status:', response.status);
      
      const data = await response.json();
      console.log('Players response data:', data);
      
      if (data.success) {
        setPlayers(data.players);
        console.log('Players loaded successfully:', data.players.length);
      } else {
        console.error('Players API returned error:', data.error);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(prev => ({ ...prev, players: false }));
    }
  };

  const loadActions = async (position) => {
    setLoading(prev => ({ ...prev, actions: true }));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('Loading actions for position:', position, 'from:', `${apiUrl}/api/actions/?position=${position}`);
      
      const response = await fetch(`${apiUrl}/api/actions/?position=${position}`);
      console.log('Actions response status:', response.status);
      
      const data = await response.json();
      console.log('Actions response data:', data);
      
      if (data.success) {
        setActions(data.actions);
        console.log('Actions loaded successfully:', data.actions.length);
      } else {
        console.error('Actions API returned error:', data.error);
      }
    } catch (error) {
      console.error('Error loading actions:', error);
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/predict-bet/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: formData.player,
          action: formData.action,
          bet_type: formData.betType,
          action_amount: parseFloat(formData.actionAmount),
          bet_amount: parseFloat(formData.betAmount) || 0,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmissionResult({
          success: true,
          message: "Prediction generated successfully!",
          predictionData: result,
        });
      } else {
        setSubmissionResult({
          success: false,
          message: result.error || "Error generating prediction. Please try again.",
          suggestions: result.suggestions || null,
        });
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: "Network error. Please check that the backend is running on port 8000.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no session, show sign-in component
  if (!session) {
    return <SignInButton />;
  }

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
                disabled={loading.teams}
              >
                <option value="">
                  {loading.teams ? "Loading teams..." : "Select Team"}
                </option>
                {teams.map((team) => (
                  <option key={team.abbreviation} value={team.abbreviation}>
                    {team.full_name} ({team.abbreviation})
                  </option>
                ))}
              </select>
            </div>

            {/* Player Selection - conditional */}
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
                  disabled={loading.players}
                >
                  <option value="">
                    {loading.players ? "Loading players..." : "Select Player"}
                  </option>
                  {players.map((player) => (
                    <option key={player.name} value={player.name}>
                      {player.name} ({player.position})
                    </option>
                  ))}
                </select>
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
                  disabled={loading.actions || !formData.player}
                >
                  <option value="">
                    {loading.actions ? "Loading actions..." : !formData.player ? "Select player first" : "Select Action"}
                  </option>
                  {actions.map((action) => (
                    <option key={action.value} value={action.value}>
                      {action.value}
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
              {isSubmitting ? "Analyzing..." : "Analyze Bet"}
            </button>
          </form>

          {submissionResult && (
            <div className="mt-6">
              {submissionResult.success && submissionResult.predictionData ? (
                <PredictionResults predictionData={submissionResult.predictionData} />
              ) : (
                <div
                  className={`p-4 rounded-lg ${
                    submissionResult.success
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  <p className="font-medium">{submissionResult.message}</p>
                  {submissionResult.suggestions && (
                    <div className="mt-2">
                      <p className="text-sm">Did you mean:</p>
                      <ul className="text-sm list-disc list-inside">
                        {submissionResult.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}