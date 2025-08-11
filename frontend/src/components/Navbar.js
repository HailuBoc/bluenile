"use client";
import { Menu, Search, Globe, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Always dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const closeMobileMenu = () => setNavOpen(false);

  return (
    <>
      {/* 🔍 Mobile Search Slide-In */}
      {showMobileSearch && (
        <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b shadow px-4 py-3 flex items-center gap-2">
          <input
            type="text"
            autoFocus
            placeholder="Where are you going?"
            className="flex-grow bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 outline-none text-sm text-gray-800 dark:text-white"
          />
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* 📱 Mobile Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b shadow-sm flex items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-blue-600 dark:text-white">
          Blue Nile PLC
        </span>
        <div className="flex items-center gap-4">
          <Search
            className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer"
            onClick={() => setShowMobileSearch(true)}
          />
          <Menu
            className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer"
            onClick={() => setNavOpen(!navOpen)}
          />
        </div>
      </header>

      {/* 📱 Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 z-50 w-full bg-white dark:bg-gray-900 border-t shadow-md flex justify-around items-center px-4 py-2">
        <button
          onClick={() => setShowMobileSearch(true)}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
        >
          <Search className="h-5 w-5 mb-1" />
          Search
        </button>
        <Link
          href="/explore"
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
        >
          <Globe className="h-5 w-5 mb-1" />
          Explore
        </Link>
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
        >
          <Menu className="h-5 w-5 mb-1" />
          Menu
        </button>
        <Link
          href="/profile"
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
        >
          <User className="h-5 w-5 mb-1" />
          Profile
        </Link>
      </nav>

      {/* 📋 Mobile Nav Drawer */}
      {navOpen && (
        <div className="fixed bottom-14 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex flex-col items-start px-5 py-4 space-y-3 z-40 rounded-t-xl">
          <Link
            href="/homes"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Homes
          </Link>
          <Link
            href="/services"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Services
          </Link>
          <Link
            href="/experiences"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Experiences
          </Link>
          <hr className="w-full border-t dark:border-gray-700 mt-2" />
          <Link
            href="/signup"
            onClick={closeMobileMenu}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-300 text-sm hover:underline"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Spacer for bottom nav */}
      <div className="pt-14 pb-20" />
    </>
  );
}
