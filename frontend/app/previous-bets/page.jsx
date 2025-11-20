'use client';

import { useState, useEffect } from "react";
import PreviousBet from "@/components/PreviousBet";

export default function PreviousBetsPage() {
	const [bets, setBets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch bets from DynamoDB on component mount
	useEffect(() => {
		const fetchBets = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/get-bets');
				const data = await response.json();

				if (data.success) {
					// Transform DynamoDB data to match component format
					const transformedBets = data.bets.map((bet, index) => ({
						id: bet.createdAt, // Use timestamp as unique ID
						player: bet.player,
						team: bet.team,
						action: bet.metric,
						betType: bet.betType.toLowerCase(),
						actionAmount: bet.line,
						betAmount: bet.wager,
						prediction: bet.aiPrediction,
						result: bet.result || null,
						date: new Date(bet.createdAt).toLocaleDateString('en-US', { 
							month: 'short', 
							day: 'numeric', 
							year: 'numeric' 
						}),
						status: bet.status.toLowerCase()
					}));
					setBets(transformedBets);
				} else {
					setError(data.error || "Failed to load bets");
				}
			} catch (err) {
				console.error("Error fetching bets:", err);
				setError("Failed to load bets. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchBets();
	}, []);

	// Handle status changes
	const handleStatusChange = async (betId, newStatus) => {
		// Optimistically update UI
		setBets(prevBets =>
			prevBets.map(bet =>
				bet.id === betId ? { ...bet, status: newStatus } : bet
			)
		);
		
		// Update DynamoDB
		try {
			const response = await fetch('/api/update-bet', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					betId: betId, // This is the createdAt timestamp
					status: newStatus,
				}),
			});

			const data = await response.json();
			
			if (!data.success) {
				console.error('Failed to update bet status:', data.error);
				// Revert optimistic update on failure
				setBets(prevBets =>
					prevBets.map(bet =>
						bet.id === betId ? { ...bet, status: bet.status } : bet
					)
				);
			}
		} catch (error) {
			console.error('Error updating bet status:', error);
			// Could add a toast notification here to inform user of failure
		}
	};

	// Calculate statistics
	const stats = {
		total: bets.length,
		won: bets.filter(bet => bet.status === 'won').length,
		lost: bets.filter(bet => bet.status === 'lost').length,
		pending: bets.filter(bet => bet.status === 'pending').length,
	};
	
	const winRate = stats.total > 0 && (stats.won + stats.lost) > 0 
		? ((stats.won / (stats.won + stats.lost)) * 100).toFixed(1) 
		: 0;

	return (
		<>
			{/* Hero Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center">
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
						Your Betting History
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
						Track your performance and analyze your betting patterns
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
						<div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
						<div className="text-blue-100 text-sm font-medium">Total Bets</div>
					</div>
					<div className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-300/30">
						<div className="text-3xl font-bold text-white mb-1">{stats.won}</div>
						<div className="text-green-100 text-sm font-medium">Won</div>
					</div>
					<div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-red-300/30">
						<div className="text-3xl font-bold text-white mb-1">{stats.lost}</div>
						<div className="text-red-100 text-sm font-medium">Lost</div>
					</div>
					<div className="bg-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/30">
						<div className="text-3xl font-bold text-white mb-1">{winRate}%</div>
						<div className="text-purple-100 text-sm font-medium">Win Rate</div>
					</div>
				</div>
			</div>

			{/* Bets List */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				{/* Loading State */}
				{loading && (
					<div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
						<div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
						<p className="text-gray-600">Loading your bets...</p>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="bg-red-50 border-2 border-red-300 rounded-3xl shadow-2xl p-12 text-center">
						<div className="text-6xl mb-4">⚠️</div>
						<h2 className="text-2xl font-bold text-red-900 mb-2">
							Error Loading Bets
						</h2>
						<p className="text-red-700 mb-6">{error}</p>
						<button 
							onClick={() => window.location.reload()}
							className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-8 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
						>
							Try Again
						</button>
					</div>
				)}

				{/* Bets List */}
				{!loading && !error && (
					<div className="space-y-6">
						{bets.map((bet) => (
							<PreviousBet 
								key={bet.id} 
								bet={bet} 
								onStatusChange={handleStatusChange}
							/>
						))}
					</div>
				)}

				{/* Empty State (for when there are no bets) */}
				{!loading && !error && bets.length === 0 && (
					<div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
						<div className="text-6xl mb-4">🎯</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							No Bets Yet
						</h2>
						<p className="text-gray-600 mb-6">
							Start by creating your first betting scenario to see it here.
						</p>
						<a 
							href="/get-started"
							className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
						>
							Create Your First Bet
						</a>
					</div>
				)}
			</div>
		</>
	);
}
