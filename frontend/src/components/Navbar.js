"use client";
import { Menu, Search, Briefcase, User, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setNavOpen(false);

  return (
    <>
      {/* ==== FULL HEADER ==== */}
      <header className="relative flex h-screen w-full top-0 z-40 flex-col">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fluxs.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full px-4 sm:px-6 md:px-12 py-4 sm:py-6 gap-y-8 sm:gap-y-12 lg:gap-y-16">
          {/* Top Navbar */}
          <div className="flex items-center justify-between">
            {/* Logo + Company Name */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Blue Nile PLC Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                Blue Nile PLC
              </span>
            </div>

            {/* Desktop Links */}
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

          {/* Welcome Section */}
          <div className="flex flex-col items-center text-center gap-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md">
              Welcome to Blue Nile PLC
            </h1>
            <p className="text-sm sm:text-lg text-gray-200 drop-shadow-sm max-w-2xl">
              All-in-one booking platform for properties, events, transport, and
              tourism in Ethiopia
            </p>
          </div>

          {/* Services Section */}

          <nav className="w-full">
            <div className="grid grid-cols-5 gap-2 px-2 sm:gap-4 sm:px-0">
              {[
                {
                  href: "/propertyrental",
                  icon: "🏠",
                  label: "Property Rentals & Bookings",
                },
                { href: "/event", icon: "🎉", label: "Event Venues" },
                { href: "/transport", icon: "🚗", label: "Transport Services" },
                { href: "/sales", icon: "🏡", label: "Sales Section" },
                { href: "/tourism", icon: "🌍", label: "Tourism Services" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex flex-col items-center p-2 sm:p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow hover:bg-slate-400/80 hover:shadow-lg transition-all duration-300 ease-out"
                >
                  <span className="text-lg sm:text-2xl">{item.icon}</span>
                  <span className="mt-1 text-[10px] sm:text-xs font-semibold text-white text-center group-hover:underline">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </nav>

          {/* Search Section */}
          <div className="w-full max-w-6xl">
            <div className="flex flex-col sm:flex-row items-stretch border justify-center text-center rounded-xl sm:rounded-full shadow-lg p-3 sm:px-8 sm:py-3 bg-white/90 dark:bg-gray-800/90 dark:border-gray-600 gap-y-3 sm:gap-y-0">
              {[
                { label: "Services", type: "text" },
                { label: "Property Rental & Bookings", type: "text" },
                { label: "Events", type: "text" },
                { label: "Transport service", type: "text" },
                { label: "Sales", type: "text" },
              ].map((field, i) => (
                <div
                  key={i}
                  className={`flex flex-col px-3 sm:px-5 ${
                    i < 4 ? "sm:border-r dark:border-gray-600" : ""
                  }`}
                >
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    {field.label}
                  </label>
                  <div className="flex items-center">
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 flex-1"
                    />
                    {i === 4 && (
                      <button className="text-blue-600 hover:text-blue-700 p-1 flex items-center justify-center">
                        <Search className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ==== Sticky Services Nav ==== */}
      {showSticky && (
        <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md animate-slideDown">
          <nav className="flex overflow-x-auto sm:overflow-visible gap-4 sm:gap-8 py-3 px-4 sm:px-0 text-sm font-semibold text-gray-700 dark:text-gray-200">
            {[
              {
                href: "/propertyrental",
                icon: "🏠",
                label: "Property Rentals",
              },
              { href: "/event", icon: "🎉", label: "Event Venues" },
              { href: "/transport", icon: "🚗", label: "Transport" },
              { href: "/sales", icon: "🏡", label: "Sales" },
              { href: "/tourism", icon: "🌍", label: "Tourism" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-1 flex-shrink-0 hover:text-blue-600 transition"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* ==== Mobile Top Buttons ==== */}
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

      {/* ==== Mobile Search Slide ==== */}
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

      {/* ==== Mobile Bottom Nav ==== */}
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
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ==== Mobile Drawer ==== */}
      {navOpen && (
        <div className="fixed top-16 right-4 bg-white dark:bg-gray-800 shadow-md flex flex-col items-start px-5 py-4 space-y-3 sm:hidden z-50 rounded-xl animate-slideDown">
          <a
            href="/"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600"
          >
            Homes
          </a>
          <a
            href="/listProperty"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600"
          >
            List your property
          </a>
          <a
            href="/aboutus"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600"
          >
            About us
          </a>
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
