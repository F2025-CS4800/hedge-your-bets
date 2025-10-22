"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import SignOutButton from "./SignOutButton";

export default function Navigation({ session }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<span className="text-2xl">🏈</span>
						<span className="text-xl font-bold text-white">
							Hedge Your Bets
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/"
							className="text-white hover:text-blue-200 transition-colors duration-300"
						>
							Home
						</Link>
						<Link
							href="/about"
							className="text-white hover:text-blue-200 transition-colors duration-300"
						>
							About Us
						</Link>
            {session ? (
							<Link
								href="/previous-bets"
                className="text-white hover:text-blue-200 transition-colors duration-300"
							>
								Previous Bets
							</Link>
						) : null}
						{session ? (
							<div className="flex items-center space-x-4">
								<span className="text-white font-medium">
									Hello,{" "}
									{session.user?.name || session.user?.email}
								</span>
								<SignOutButton />
							</div>
						) : (
							<Link
								href="/get-started"
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
							>
								Get Started
							</Link>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-white hover:text-blue-200 transition-colors duration-300"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md rounded-lg mt-2">
							<Link
								href="/"
								className="block px-3 py-2 text-white hover:text-blue-200 transition-colors duration-300"
							>
								Home
							</Link>
							<Link
								href="/about"
								className="block px-3 py-2 text-white hover:text-blue-200 transition-colors duration-300"
							>
								About Us
							</Link>
							<div className="px-3 py-2">
								{session ? (
									<div className="space-y-2">
										<div className="text-white font-medium text-center">
											Hello,{" "}
											{session.user?.name ||
												session.user?.email}
										</div>
										<SignOutButton fullWidth={true} />
									</div>
								) : (
									<Link
										href="/"
										className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full block text-center"
									>
										Get Started
									</Link>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
