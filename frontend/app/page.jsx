import { auth } from "@/auth";
import BettingForm from "@/components/BettingForm";

export default async function HomePage() {
  const session = await auth();
	console.log("Session in page.jsx:", session);
	console.log("here?");
  return (
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
               Hedge Your Bets hello {session?.user?.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              AI-Powered Sports Betting Analysis
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
              Make smarter betting decisions with our advanced analytics and machine learning insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Pass session to client component */}
      <BettingForm session={session} />
    </>
  )
}
