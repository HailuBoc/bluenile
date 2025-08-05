"use client";
import { Menu, Search, Globe, User, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      {/* 🌐 Top Navbar (PC) */}
      <header className="hidden sm:flex sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md px-4 py-3 items-center justify-between md:px-6 transition-colors duration-300">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img
            src="/akotet.png"
            alt="Akotet"
            className="h-10 w-auto transition-transform duration-300 hover:scale-110"
          />
          <span className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-white tracking-wider uppercase">
            Akotet
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-300 font-medium text-sm">
          <a href="#" className="hover:text-red-500 transition">
            Homes
          </a>
          <a href="#" className="hover:text-red-500 transition">
            Services
          </a>
          <a href="#" className="hover:text-red-500 transition">
            Experiences
          </a>
        </nav>

        {/* Search Bar */}
        <div className="flex items-center justify-between border rounded-full shadow-sm px-4 py-2 w-full max-w-sm mx-4 dark:bg-gray-800 dark:border-gray-600">
          <input
            type="text"
            placeholder="Search destinations"
            className="flex-grow bg-transparent outline-none text-sm text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Search className="h-5 w-5 text-white bg-red-400 p-1 rounded-full cursor-pointer" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-300">
          <p className="hidden md:inline cursor-pointer text-sm">
            Become a host
          </p>
          <Globe className="h-5 w-5 cursor-pointer" />
          <div className="hidden md:flex items-center border p-2 rounded-full space-x-2 cursor-pointer dark:border-gray-600">
            <Menu className="h-5 w-5" />
            <User className="h-5 w-5" />
          </div>
          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* 🔍 Mobile Search Slide-In */}
      {showMobileSearch && (
        <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b shadow px-4 py-3 flex items-center gap-2 sm:hidden">
          <input
            type="text"
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

      {/* 📱 Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 z-50 w-full bg-white dark:bg-gray-900 border-t shadow-md flex justify-around items-center px-4 py-2 sm:hidden">
        <button
          onClick={() => setShowMobileSearch(true)}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          <Search className="h-5 w-5" />
          Search
        </button>
        <button className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500">
          <Globe className="h-5 w-5" />
          Explore
        </button>
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          <Menu className="h-5 w-5" />
          Menu
        </button>
        <button className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500">
          <User className="h-5 w-5" />
          Profile
        </button>
      </nav>

      {/* 📋 Mobile Nav Drawer */}
      {navOpen && (
        <div className="fixed bottom-14 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex flex-col items-start px-5 py-4 space-y-3 sm:hidden z-40">
          <a
            href="#"
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Homes
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Services
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Experiences
          </a>
        </div>
      )}
    </>
  );
}
