'use client';

import { useState } from "react";
import SignInButton from "./SignInButton";

export default function BettingForm({ session }) {
  // If no session, show sign-in component
  if (!sessi/z

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

  // Team and player data - Football only
  const teamData = {
    football: {
      "Kansas City Chiefs": [
        "Patrick Mahomes",
        "Travis Kelce", 
        "Tyreek Hill",
        "Clyde Edwards-Helaire",
        "Tyrann Mathieu",
      ],
      "Tampa Bay Buccaneers": [
        "Tom Brady",
        "Mike Evans",
        "Leonard Fournette",
        "Rob Gronkowski",
        "Antonio Brown",
      ],
      "Green Bay Packers": [
        "Aaron Rodgers",
        "Davante Adams", 
        "Aaron Jones",
        "Randall Cobb",
        "Jaire Alexander",
      ],
      "Buffalo Bills": [
        "Josh Allen",
        "Stefon Diggs",
        "Cole Beasley",
        "Devin Singletary",
        "Tre'Davious White",
      ],
      "Los Angeles Rams": [
        "Matthew Stafford",
        "Cooper Kupp",
        "Odell Beckham Jr.",
        "Cam Akers", 
        "Aaron Donald",
      ],
      "Dallas Cowboys": [
        "Dak Prescott",
        "Ezekiel Elliott",
        "Amari Cooper",
        "CeeDee Lamb",
        "Micah Parsons",
      ],
      "New England Patriots": [
        "Mac Jones",
        "Damien Harris",
        "Jakobi Meyers",
        "Hunter Henry",
        "Matthew Judon",
      ],
      "Pittsburgh Steelers": [
        "Ben Roethlisberger",
        "Najee Harris",
        "Diontae Johnson", 
        "Chase Claypool",
        "T.J. Watt",
      ],
    },
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
      // Simulate API call - replace with actual backend integration later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmissionResult({
        success: true,
        message: "Betting scenario created successfully!",
        data: formData,
      });

      // Reset form
      setFormData({
        sport: "football",
        team: "",
        player: "",
        betType: "",
        action: "",
        actionAmount: "",
        betAmount: "",
      });
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: "Error creating betting scenario. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              >
                <option value="">Select Team</option>
                {Object.keys(teamData.football || {}).map((team) => (
                  <option key={team} value={team}>
                    {team}
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
                >
                  <option value="">Select Player</option>
                  {teamData.football[formData.team]?.map((player) => (
                    <option key={player} value={player}>
                      {player}
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
              {isSubmitting ? "Analyzing..." : "Analyze Bet"}
            </button>
          </form>

          {submissionResult && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                submissionResult.success
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <p className="font-medium">{submissionResult.message}</p>
              {submissionResult.success && submissionResult.data && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Submitted Data:
                  </h4>
                  <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                    {JSON.stringify(submissionResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}