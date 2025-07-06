"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HeaderMain = () => {
  const router = useRouter();

  return (
    <header className="border-b border-gray-200 py-6 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Logo and Tagline */}
        <div className="w-full flex justify-center">
          <div className="flex flex-col items-center text-center mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-[#0a0f2c]">Hulu School</h1>
            <p className="text-sm text-gray-500 tracking-wide mt-1">
              Personalized Online & In-Person Tutoring
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          <Link
            href="/signup"
            className="relative px-6 py-1 text-sm rounded-md bg-[#0a0f2c] text-white font-medium shadow-md shadow-blue-900/40 hover:bg-[#112358] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Sign Up</span>
            <span className="absolute inset-0 bg-blue-800 opacity-10 rounded-full blur-xl animate-pulse" />
          </Link>

          <Link
            href="/login"
            className="relative px-6 py-1 text-sm rounded-md border border-blue-700 text-blue-600 font-medium shadow-md shadow-blue-900/40 hover:bg-blue-800 hover:text-white transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Log In</span>
            <span className="absolute inset-0 bg-blue-600 opacity-10 rounded-full blur-xl animate-pulse" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
