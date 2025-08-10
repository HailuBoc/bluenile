"use client";
import { Menu, Search, Globe, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Always apply dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const closeMobileMenu = () => setNavOpen(false);

  return (
    <>
      {/* Desktop Header with full screen background */}
      <header className="relative hidden sm:flex h-screen w-full top-0 z-50 transition-colors duration-300 flex-col">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fluxs.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full px-6 md:px-10 py-6">
          {/* Top navbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-white tracking-wide select-none">
                Blue Nile Plc
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white">
              <Link href="/listProperty">
                <button className="hover:underline transition">
                  List your property
                </button>
              </Link>
              <a
                href="/login"
                className="px-4 py-2 border border-white rounded-md text-white hover:bg-white hover:text-blue-900 transition"
              >
                Sign in
              </a>
              <Link href={"/aboutus"}>
                {" "}
                <button className="hover:underline transition">About us</button>
              </Link>
              {/* 🔥 Removed dark/light toggle button */}
            </div>
          </div>

          {/* === NEW TEXT SECTION WITH ROUTES AND ANIMATION === */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4 space-y-8">
            {/* Routes / Services Section */}
            <nav className="flex  flex-wrap justify-center gap-8 text-white text-sm font-semibold max-w-5xl animate-bounce mb-6 -mt-6">
              {[
                {
                  href: "/propertyrental",
                  icon: "🏠",
                  label: "Property Rentals & Bookings",
                },
                {
                  href: "/event",
                  icon: "🎉",
                  label: "Event Venues & Support",
                },
                {
                  href: "/transport",
                  icon: "🚗",
                  label: "Transport Services",
                },
                { href: "/sales", icon: "🏡", label: "Sales Section" },
                {
                  href: "/tourism",
                  icon: "🌍",
                  label: "Tourism Services ",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="group cursor-pointer flex flex-col items-center max-w-[150px] p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20
                   shadow-md hover:bg-slate-400 hover:shadow-lg transition-all duration-300 ease-out"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="mt-2 text-center group-hover:underline">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Welcome Text */}
            <div className="animate-fadeUp">
              <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
                Welcome to Blue Nile PLC
              </h1>
              <p className="mt-2 text-lg text-gray-200 drop-shadow-sm max-w-2xl">
                All-in-one booking platform for properties, events, transport,
                and tourism in Ethiopia
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-5xl animate-fadeUp animation-delay-300">
              <div className="flex items-center justify-between border rounded-full shadow-lg px-6 py-3 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 dark:border-gray-600">
                {/* Destination */}
                <div className="flex flex-col px-4 border-r dark:border-gray-600 min-w-[150px]">
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                {/* Check-in */}
                <div className="flex flex-col px-4 border-r dark:border-gray-600 min-w-[120px]">
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="bg-transparent outline-none text-sm text-gray-700 dark:text-white"
                  />
                </div>
                {/* Check-out */}
                <div className="flex flex-col px-4 border-r dark:border-gray-600 min-w-[120px]">
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="bg-transparent outline-none text-sm text-gray-700 dark:text-white"
                  />
                </div>
                {/* Guests */}
                <div className="flex flex-col px-4 min-w-[100px]">
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="2 guests"
                    className="bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                {/* Search Button */}
                <div className="pl-4">
                  <Search className="h-8 w-8 text-white bg-blue-600 p-3 rounded-full cursor-pointer shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔍 Mobile Search Slide-In */}
      {showMobileSearch && (
        <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b shadow px-4 py-3 flex items-center gap-2 sm:hidden">
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

      {/* 📱 Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 z-50 w-full bg-white dark:bg-gray-900 border-t shadow-md flex justify-around items-center px-4 py-2 sm:hidden">
        <button
          onClick={() => setShowMobileSearch(true)}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500 focus:outline-none"
        >
          <Search className="h-5 w-5 mb-1" />
          Search
        </button>
        <button className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500 focus:outline-none">
          <Globe className="h-5 w-5 mb-1" />
          Explore
        </button>
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500 focus:outline-none"
        >
          <Menu className="h-5 w-5 mb-1" />
          Menu
        </button>
        <button className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-red-500 focus:outline-none">
          <User className="h-5 w-5 mb-1" />
          Profile
        </button>
      </nav>

      {/* 📋 Mobile Nav Drawer */}
      {navOpen && (
        <div className="fixed bottom-14 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex flex-col items-start px-5 py-4 space-y-3 sm:hidden z-40 rounded-t-xl">
          <a
            href="#"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Homes
          </a>
          <a
            href="#"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Services
          </a>
          <a
            href="#"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-red-500"
          >
            Experiences
          </a>
          <hr className="w-full border-t dark:border-gray-700 mt-2" />
          <a
            href="/signup"
            onClick={closeMobileMenu}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            Sign Up
          </a>
          <a
            href="/signin"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-300 text-sm hover:underline"
          >
            Sign In
          </a>
        </div>
      )}

      <div className="sm:hidden pt-4 pb-20" />
    </>
  );
}
