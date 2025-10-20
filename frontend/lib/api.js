/**
 * API utilities for making requests to the backend
 */

// Get API URL from environment variable, fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Make a prediction for a betting scenario
 * @param {Object} data - Betting scenario data
 * @returns {Promise<Object>} Prediction results
 */
export async function predictBet(data) {
  const response = await fetch(`${API_URL}/predict-bet/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to get prediction');
  }

  return result;
}

/**
 * Get all available teams
 * @returns {Promise<Object>} List of teams
 */
export async function getAllTeams() {
  const response = await fetch(`${API_URL}/teams/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch teams');
  }

  return result;
}

/**
 * Get players for a specific team
 * @param {string} team - Team abbreviation or full name
 * @param {string} position - Optional position filter (QB, RB, WR, TE)
 * @returns {Promise<Object>} List of players
 */
export async function getPlayersByTeam(team, position = null) {
  const params = new URLSearchParams({ team });
  if (position) {
    params.append('position', position);
  }

  const response = await fetch(`${API_URL}/players/?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch players');
  }

  return result;
}

/**
 * Get all betting scenarios
 * @returns {Promise<Object>} List of betting scenarios
 */
export async function getBettingScenarios() {
  const response = await fetch(`${API_URL}/betting-scenarios/list/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch betting scenarios');
  }

  return result;
}

export { API_URL };

