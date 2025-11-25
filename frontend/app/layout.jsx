import "../styles/globals.css";
import Navigation from "../components/Navigation.jsx";
import { auth } from "@/auth";
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import Script from "next/script";

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
			<head>
				<Script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-HCF0CK31ZG"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-HCF0CK31ZG');
					`}
				</Script>
			</head>
			<body className="antialiased">
				<SessionProviderWrapper session={session}>
					<div className="min-h-screen bg-gray-950">
						<Navigation session={session} />
						<main>{children}</main>
					</div>
				</SessionProviderWrapper>
			</body>
		</html>
	);
}
