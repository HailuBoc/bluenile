"use client";
import { Menu, Search, Briefcase, User, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const closeMobileMenu = () => setNavOpen(false);

  return (
    <>
      {/* ==== FULL HEADER (NOW ALSO ON MOBILE) ==== */}
      <header className="relative flex h-screen w-full top-0 z-40 flex-col">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fluxs.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full px-4 sm:px-6 md:px-12 py-4 sm:py-6">
          {/* Top Navbar */}
          <div className="flex items-center justify-between">
            <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">
              Blue Nile Plc
            </span>
            <div className="hidden sm:flex items-center gap-6 text-sm text-white">
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
              <Link href="/aboutus">
                <button className="hover:underline transition">About us</button>
              </Link>
            </div>
          </div>

          {/* Services & Search Section */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-2 sm:px-4 space-y-6 sm:space-y-10">
            {/* Services */}
            <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 text-white text-xs sm:text-sm font-semibold max-w-5xl animate-bounce">
              {[
                {
                  href: "/propertyrental",
                  icon: "🏠",
                  label: "Property Rentals",
                },
                { href: "/event", icon: "🎉", label: "Event Venues" },
                { href: "/transport", icon: "🚗", label: "Transport Services" },
                { href: "/sales", icon: "🏡", label: "Sales Section" },
                { href: "/tourism", icon: "🌍", label: "Tourism Services" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="group flex flex-col items-center max-w-[120px] sm:max-w-[150px] p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20
                  shadow-md hover:bg-slate-400/80 hover:shadow-lg transition-all duration-300 ease-out"
                >
                  <span className="text-xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="mt-1 sm:mt-2 text-center group-hover:underline">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Welcome */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md">
                Welcome to Blue Nile PLC
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-gray-200 drop-shadow-sm max-w-2xl">
                All-in-one booking platform for properties, events, transport,
                and tourism in Ethiopia
              </p>
            </div>

            {/* Search */}
            <div className="w-full max-w-5xl px-2 sm:px-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border rounded-xl sm:rounded-full shadow-lg p-3 sm:px-6 sm:py-3 bg-white/90 dark:bg-gray-800/90 dark:border-gray-600 space-y-2 sm:space-y-0">
                {[
                  {
                    label: "Destination",
                    type: "text",
                    placeholder: "Where are you going?",
                  },
                  { label: "Check-in", type: "date" },
                  { label: "Check-out", type: "date" },
                  { label: "Guests", type: "number", placeholder: "2 guests" },
                ].map((field, i) => (
                  <div
                    key={i}
                    className={`flex flex-col px-2 sm:px-4 ${
                      i < 3 ? "sm:border-r dark:border-gray-600" : ""
                    }`}
                  >
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      min={field.type === "number" ? "1" : undefined}
                      className="bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                ))}
                <div className="pl-0 sm:pl-4 flex justify-center">
                  <Search className="h-8 w-8 text-white bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* ==== TOP RIGHT MOBILE BUTTONS ==== */}
      <div className="fixed top-4 right-4 flex gap-2 z-50 sm:hidden">
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
        >
          {navOpen ? (
            <X className="h-6 w-6 text-gray-800 dark:text-white" />
          ) : (
            <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
          )}
        </button>
      </div>
      {/* ==== MOBILE SEARCH SLIDE ==== */}
      {showMobileSearch && (
        <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b shadow px-4 py-3 flex items-center gap-2 sm:hidden animate-slideDown">
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
      {/* ==== MOBILE BOTTOM NAV ==== */}

      {/* ==== MOBILE BOTTOM NAV ==== */}
      <nav className="fixed bottom-0 z-50 w-full bg-white dark:bg-gray-900 border-t shadow-md flex justify-around items-center px-4 py-2 sm:hidden">
        {[
          { href: "/", icon: <Home className="h-5 w-5 mb-1" />, label: "Home" },
          {
            href: "/services",
            icon: <Briefcase className="h-5 w-5 mb-1" />,
            label: "Services",
          },
          {
            href: "/profile",
            icon: <User className="h-5 w-5 mb-1" />,
            label: "Profile",
          },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 focus:outline-none"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ==== MOBILE NAV DRAWER ==== */}
      {navOpen && (
        <div className="fixed top-16 right-4 bg-white dark:bg-gray-800 shadow-md flex flex-col items-start px-5 py-4 space-y-3 sm:hidden z-50 rounded-xl animate-slideDown">
          {["Homes", "List your property", "About us"].map((link, i) => (
            <a
              key={i}
              href="#"
              onClick={closeMobileMenu}
              className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600"
            >
              {link}
            </a>
          ))}
          <hr className="w-full border-t dark:border-gray-700 mt-2" />

          <a
            href="/login"
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
