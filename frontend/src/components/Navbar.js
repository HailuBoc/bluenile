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
                href="/auth/login"
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
            {(() => {
              const services = [
                {
                  href: "/propertyrental",
                  icon: "🏠",
                  label: "Property Rentals & Bookings",
                },
                { href: "/event", icon: "🎉", label: "Event Venues" },
                { href: "/transport", icon: "🚗", label: "Transport Services" },
                { href: "/sales", icon: "🏡", label: "Sales Section" },
                { href: "/tourism", icon: "🌍", label: "Tourism Services" },
              ];

              const Tile = ({ href, icon, label }) => (
                <Link
                  href={href}
                  className="flex flex-col items-center justify-center 
                   p-6 sm:p-4 rounded-xl 
                   bg-white/10 backdrop-blur-md 
                   border border-white/20 shadow 
                   hover:bg-slate-400/80 hover:shadow-lg 
                   transition-all duration-300 ease-out 
                   min-h-[100px] sm:min-h-[110px]"
                >
                  <span className="text-2xl sm:text-xl">{icon}</span>
                  <span className="mt-2 text-xs sm:text-sm font-semibold text-white text-center">
                    {label}
                  </span>
                </Link>
              );

              return (
                <>
                  {/* Mobile layout: 2 + 2 + 1 */}
                  <div className="sm:hidden w-full">
                    <div className="grid grid-cols-2 gap-3 px-2">
                      {services.slice(0, 2).map((s) => (
                        <Tile key={s.label} {...s} />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 px-2 mt-3">
                      {services.slice(2, 4).map((s) => (
                        <Tile key={s.label} {...s} />
                      ))}
                    </div>

                    <div className="flex justify-center mt-3 px-2 gap-3">
                      {services.slice(4).map((s) => (
                        <Tile key={s.label} {...s} />
                      ))}
                    </div>
                  </div>

                  <div className="hidden sm:grid grid-cols-5 gap-4 sm:px-0">
                    {services.map((s) => (
                      <Tile key={s.label} {...s} />
                    ))}
                  </div>
                </>
              );
            })()}
          </nav>

          {/* Desktop Search Section */}
          <div className="w-full max-w-6xl hidden sm:block">
            <div className="flex flex-col sm:flex-row items-stretch border justify-center text-center rounded-xl sm:rounded-full shadow-lg p-3 sm:px-8 sm:py-3 bg-white/90 dark:bg-gray-800/90 dark:border-gray-600 gap-y-3 sm:gap-y-0">
              {[
                { label: "Services", href: "/services" },
                {
                  label: "Property Rental & Bookings",
                  href: "/propertyrental",
                },
                { label: "Events", href: "/event" },
                { label: "Transport service", href: "/transport" },
                { label: "Sales", href: "/sales" },
              ].map((field, i) => {
                const [query, setQuery] = useState("");
                return (
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
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-transparent outline-none text-sm text-gray-700 dark:text-white flex-1"
                        id={`search-${field.label
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      />
                    </div>
                  </div>
                );
              })}

              {/* === Desktop Search Icon Button === */}
              <div className="flex items-center justify-center px-3">
                <button
                  onClick={() => {
                    const fields = [
                      { label: "Services", href: "/services" },
                      {
                        label: "Property Rental & Bookings",
                        href: "/propertyrental",
                      },
                      { label: "Events", href: "/event" },
                      { label: "Transport service", href: "/transport" },
                      { label: "Sales", href: "/sales" },
                    ];

                    let targetHref = "/services";
                    let queryParam = "";

                    for (const field of fields) {
                      const input = document.getElementById(
                        `search-${field.label
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      );
                      if (input && input.value.trim() !== "") {
                        targetHref = field.href;
                        queryParam = input.value.trim();
                        break;
                      }
                    }

                    const url = queryParam
                      ? `${targetHref}?q=${encodeURIComponent(queryParam)}`
                      : targetHref;
                    window.location.href = url;
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition duration-200 flex items-center justify-center"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

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

      {/* ==== Mobile Search Bar with Search Icon === */}
      <div className="sm:hidden w-full bg-white dark:bg-gray-900   border-b shadow px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-1 mb-3">
          <input
            type="text"
            placeholder="Search..."
            id="mobile-search-input"
            className="flex-grow bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 outline-none text-sm text-gray-800 dark:text-white"
          />
          <button
            onClick={() => {
              const queryInput = document.getElementById("mobile-search-input");
              const queryValue = queryInput?.value.trim() || "";
              if (queryValue) {
                window.location.href = `/products?q=${encodeURIComponent(
                  queryValue
                )}`;
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full flex items-center justify-center transition"
          >
            <Search size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: "Property Rentals", href: "/propertyrental" },
            { label: "Events", href: "/event" },
            { label: "Transport", href: "/transport" },
            { label: "Sales", href: "/sales" },
            { label: "Tourism", href: "/tourism" },
          ].map((service) => (
            <button
              key={service.label}
              onClick={() => {
                const queryInput = document.getElementById(
                  "mobile-search-input"
                );
                const queryValue = queryInput?.value.trim() || "";
                const url = queryValue
                  ? `${service.href}?q=${encodeURIComponent(queryValue)}`
                  : service.href;
                window.location.href = url;
              }}
              className="px-3 py-1 rounded-full border text-xs font-medium 
                   text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 
                   hover:bg-blue-600 hover:text-white transition"
            >
              {service.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==== Mobile Bottom Nav ==== */}
      <nav className="fixed bottom-0 z-50 w-full bg-white dark:bg-gray-900 border-t shadow-md flex justify-around items-center px-4 py-2 sm:hidden">
        {[
          { href: "/", icon: <Home className="h-5 w-5 mb-1" />, label: "Home" },
          {
            href: "/services",
            icon: <Briefcase className="h-5 w-5 mb-1" />,
            label: "Services",
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
