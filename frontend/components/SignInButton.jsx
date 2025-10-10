'use client';

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <div className="text-center py-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sign In Required
        </h2>
        <p className="text-gray-600 mb-6">
          Please sign in to create betting scenarios and access our AI-powered analysis.
        </p>
        <button
          onClick={() => signIn("github")}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Sign In with GitHub
        </button>
      </div>
    </div>
  );
}