import "../styles/globals.css";
import Navigation from "../components/Navigation";
import { getServerSession } from "next-auth";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import { authOptions } from "../auth";

export const metadata = {
	title: "Hedge Your Bets - AI-Powered Sports Betting Analysis",
	description:
		"Make smarter betting decisions with our advanced analytics and machine learning insights",
	keywords: "sports betting, AI, analytics, football, predictions",
};

export default async function RootLayout({ children }) {
	const session = await getServerSession(authOptions);

	return (
		<html lang="en">
			<body className="antialiased">
				<SessionProviderWrapper session={session}>
					<div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
						<Navigation session={session} />
						<main>{children}</main>
					</div>
				</SessionProviderWrapper>
			</body>
		</html>
	);
}
