import "../styles/globals.css";
import Navigation from "../components/Navigation";
import { auth } from "@/auth";

export const metadata = {
	title: "Hedge Your Bets - AI-Powered Sports Betting Analysis",
	description:
		"Make smarter betting decisions with our advanced analytics and machine learning insights",
	keywords: "sports betting, AI, analytics, football, predictions",
};

export default async function RootLayout({ children }) {
	const session = await auth();

	return (
		<html lang="en">
			<body className="antialiased">
				<div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
					<Navigation session={session} />
					<main>{children}</main>
				</div>
			</body>
		</html>
	);
}
