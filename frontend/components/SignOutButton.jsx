'use client';

import { signOut } from "next-auth/react";

export default function SignOutButton({ fullWidth = false }) {
  return (
    <button
      onClick={() => signOut("github")}
      className={`bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${fullWidth ? 'w-full' : ''}`}
    >
      Sign Out
    </button>
  );
}