"use client";
import { Menu, Search, Briefcase, User, X, Home } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);

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
      <header className="relative flex w-full top-0 z-40 flex-col overflow-hidden">
        {/* Background with modern overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/fluxs.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full px-4 sm:px-6 md:px-12 py-4 sm:py-6 gap-y-8 sm:gap-y-12 lg:gap-y-16">
          {/* Top Navbar */}
          <div className="flex items-center justify-between">
            {/* Logo + Company Name */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo.jpg"
                  alt="Blue Nile PLC Logo"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white tracking-wide bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Blue Nile PLC
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link href="/listProperty">
                <button className="text-white/90 hover:text-white hover:underline transition-all duration-300 relative group">
                  List your property
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              </Link>
              <a
                href="/auth/login"
                className="px-6 py-2.5 border border-white/30 rounded-full text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                Sign in
              </a>
              <Link href="/aboutus">
                <button className="text-white/90 hover:text-white hover:underline transition-all duration-300 relative group">
                  About us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              </Link>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="flex flex-col items-center text-center gap-4 sm:gap-6 lg:gap-8 animate-fade-in-up px-4">
            <div className="relative">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-2xl bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                Welcome to Blue Nile PLC
              </h1>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl opacity-75"></div>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 drop-shadow-lg max-w-4xl leading-relaxed font-light px-2">
              All-in-one booking platform for properties, events, transport, and
              tourism in Ethiopia
            </p>
            <div className="flex flex-row gap-3 sm:gap-4 mt-4 w-full max-w-md sm:max-w-none justify-center">
              <Link href={"/services"}>
                <button className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                  Explore Services
                </button>
              </Link>

              <button
                onClick={() => setShowLearnModal(true)}
                className="px-6 sm:px-8 py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Learn More
              </button>
            </div>
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
                  className="group flex flex-col items-center justify-center 
                   p-4 xs:p-5 sm:p-4 md:p-5 lg:p-6 rounded-2xl 
                   bg-white/10 backdrop-blur-lg 
                   border border-white/20 shadow-lg
                   hover:bg-white/20 hover:shadow-2xl hover:border-white/40
                   hover:scale-105 hover:-translate-y-2
                   transition-all duration-500 ease-out 
                   min-h-[90px] xs:min-h-[100px] sm:min-h-[110px] md:min-h-[120px]
                   relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <span className="text-2xl xs:text-3xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-300">
                      {icon}
                    </span>
                    <span className="mt-2 xs:mt-3 text-xs xs:text-sm sm:text-sm md:text-sm font-semibold text-white text-center group-hover:text-blue-100 transition-colors duration-300 leading-tight px-1">
                      {label}
                    </span>
                  </div>
                </Link>
              );

              return (
                <>
                  {/* Mobile layout: 2 + 2 + 1 */}
                  <div className="sm:hidden w-full px-2">
                    <div className="grid grid-cols-2 gap-3 xs:gap-4">
                      {services.slice(0, 2).map((s) => (
                        <Tile key={s.label} {...s} />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 xs:gap-4 mt-3 xs:mt-4">
                      {services.slice(2, 4).map((s) => (
                        <Tile key={s.label} {...s} />
                      ))}
                    </div>

                    <div className="flex justify-center mt-3 xs:mt-4 gap-3 xs:gap-4">
                      {services.slice(4).map((s) => (
                        <Tile key={s.label} {...s} />
                      ))}
                    </div>
                  </div>

                  {/* Tablet layout: 3 columns */}
                  <div className="hidden sm:grid md:hidden grid-cols-3 gap-4 sm:px-0">
                    {services.slice(0, 3).map((s) => (
                      <Tile key={s.label} {...s} />
                    ))}
                    <div className="col-span-2">
                      <Tile {...services[3]} />
                    </div>
                    <div className="col-span-3">
                      <Tile {...services[4]} />
                    </div>
                  </div>

                  {/* Desktop layout: 5 columns */}
                  <div className="hidden md:grid grid-cols-5 gap-4 lg:gap-6">
                    {services.map((s) => (
                      <Tile key={s.label} {...s} />
                    ))}
                  </div>
                </>
              );
            })()}
          </nav>

          {/* Desktop Search Section */}
          <div className="w-full max-w-6xl hidden sm:block px-4 sm:px-0">
            <div className="flex flex-col md:flex-row items-stretch border justify-center text-center rounded-2xl md:rounded-full shadow-2xl p-4 md:px-8 md:py-4 bg-white/95 dark:bg-gray-800/95 dark:border-gray-600 backdrop-blur-xl gap-y-3 md:gap-y-0 hover:shadow-3xl transition-all duration-300">
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-110 shadow-lg hover:shadow-xl"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Learn More Modal */}
      {showLearnModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 lg:pt-40 bg-black/60 overflow-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowLearnModal(false)}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-700 dark:text-white" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Learn More
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Welcome to Blue Nile PLC — an all-in-one booking platform for
              properties, events, transport and tourism in Ethiopia. Explore
              services, list your property, or contact us for more details.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <Link href="/services">
                <button
                  onClick={() => setShowLearnModal(false)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm"
                >
                  View Services
                </button>
              </Link>
              <button
                onClick={() => setShowLearnModal(false)}
                className="px-4 py-2 border rounded-full text-sm"
              >
                Close
              </button>
            </div>
          </div>
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

      {/* ==== Mobile Search Bar with Search Icon ==== */}
      <div className="sm:hidden w-full bg-transparent backdrop-blur-xl border-b border-transparent shadow-none px-0 py-0 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Search..."
            id="mobile-search-input"
            className="flex-grow bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-3 outline-none text-sm text-gray-800 dark:text-white border border-gray-200/50 dark:border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <Search size={18} />
          </button>
        </div>

        {/* ==== Quick Service Buttons ==== */}
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
              className="px-4 py-2 rounded-full border text-xs font-medium 
                   text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 
                   hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white 
                   hover:border-transparent transition-all duration-300 hover:scale-105"
            >
              {service.label}
            </button>
          ))}
        </div>
      </div>

      {/* ==== Mobile Bottom Navigation ==== */}
      <nav className="fixed bottom-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg flex justify-around items-center px-4 py-3 sm:hidden">
        {[
          { href: "/", icon: <Home className="h-5 w-5 mb-1" />, label: "Home" },
          {
            href: "/services",
            icon: <Briefcase className="h-5 w-5 mb-1" />,
            label: "Services",
          },
          {
            href: "/auth/profile",
            icon: <User className="h-5 w-5 mb-1" />,
            label: "Account",
          },
        ].map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-all duration-300 hover:scale-110 group"
          >
            <div className="group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:rounded-full group-hover:p-2 transition-all duration-300">
              {item.icon}
            </div>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ==== Mobile Drawer ==== */}
      {navOpen && (
        <div className="fixed top-16 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl flex flex-col items-start px-6 py-5 space-y-4 sm:hidden z-50 rounded-2xl animate-slideDown border border-gray-200/50 dark:border-gray-700/50">
          <a
            href="/"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600 transition-colors duration-300 hover:translate-x-1"
          >
            Home
          </a>
          <a
            href="/listProperty"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600 transition-colors duration-300 hover:translate-x-1"
          >
            List your property
          </a>
          <a
            href="/aboutus"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-200 text-sm hover:text-blue-600 transition-colors duration-300 hover:translate-x-1"
          >
            About us
          </a>
          <hr className="w-full border-t border-gray-200 dark:border-gray-700 mt-2" />
          <a
            href="/auth/login"
            onClick={closeMobileMenu}
            className="text-gray-700 dark:text-gray-300 text-sm hover:text-blue-600 transition-colors duration-300 hover:translate-x-1"
          >
            Sign In
          </a>
        </div>
      )}

      {/* Spacer so bottom nav doesn’t overlap content */}
      <div className="sm:hidden pt-4 pb-20" />
    </>
  );
}
