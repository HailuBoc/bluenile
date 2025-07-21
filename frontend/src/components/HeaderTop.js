"use client";

import React from "react";
import { useRouter } from "next/navigation";

const HeaderTop = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Top Bar: Tagline */}
      <div className="bg-gradient-to-r from-green-50 via-white to-green-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center items-center">
          <p className="text-center text-sm sm:text-base text-gray-700 font-medium tracking-wide">
            <span className="font-semibold text-black">
              OUTSTANDING TUTORING
            </span>{" "}
            FOR THE FUTURE OF YOUR CHILDREN
          </p>
        </div>
      </div>

      {/* Main Header: Logo & Subtitle */}
      <div className="border-b border-gray-200 py-5">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          {/* Left: Placeholder for future social or nav icons */}
          <div className="hidden sm:block sm:w-1/4"></div>

          {/* Center: Logo */}
          <div className="w-full sm:w-2/4 flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0a0f2c] tracking-tight">
              Hulu School
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1 tracking-wide">
              Personalized Online & In-Person Tutoring
            </p>
          </div>

          {/* Right: Placeholder for future cart or CTA */}
          <div className="hidden sm:flex sm:w-1/4 justify-end items-center">
            {/* Add future icon here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderTop;
