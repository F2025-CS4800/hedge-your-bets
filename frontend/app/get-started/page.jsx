export const metadata = {
	title: "About Us - Hedge Your Bets",
	description:
		"Learn about our mission to revolutionize sports betting with AI and data science",
};

export default function AboutPage() {
	const teamMembers = [
		{
			name: "Jason",
			role: "Full Stack Developer",
			description:
				"Passionate about creating innovative betting analysis tools with modern web technologies.",
			emoji: "👨‍💻",
		},
		{
			name: "AI Assistant",
			role: "Machine Learning Engineer",
			description:
				"Developing cutting-edge algorithms for sports betting predictions and risk analysis.",
			emoji: "🤖",
		},
		{
			name: "Data Science Team",
			role: "Data Scientists",
			description:
				"Analyzing vast amounts of sports data to provide accurate betting insights.",
			emoji: "📊",
		},
	];

	const features = [
		{
			title: "AI-Powered Analysis",
			description:
				"Our machine learning algorithms analyze player statistics, team performance, and historical data to provide accurate betting recommendations.",
			icon: "🧠",
			color: "from-blue-500 to-cyan-500",
		},
		{
			title: "Real-Time Data",
			description:
				"Access up-to-date player stats, injury reports, and team news to make informed betting decisions.",
			icon: "⚡",
			color: "from-purple-500 to-pink-500",
		},
		{
			title: "Risk Management",
			description:
				"Advanced risk assessment tools help you understand the potential outcomes and manage your betting portfolio.",
			icon: "🛡️",
			color: "from-green-500 to-teal-500",
		},
		{
			title: "User-Friendly Interface",
			description:
				"Clean, modern design makes it easy to create betting scenarios and understand complex analytics.",
			icon: "🎨",
			color: "from-orange-500 to-red-500",
		},
	];

	return (
		<>
			{/* Hero Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center">
					<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
						Getting Started with Hedge Your Bets
					</h1>
					<p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
						We're revolutionizing sports betting with artificial
						intelligence and data science
					</p>
				</div>
			</div>

		</>
	);
}
