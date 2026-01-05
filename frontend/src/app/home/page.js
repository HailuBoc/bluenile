"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Menu, Search, Briefcase, User, X, Home } from "lucide-react";

/* Product cards (assumed present in same project) */
import ProductCard from "../../components/ProductCard";
import HousesCard from "../../components/HousesCard";
import CarsCard from "../../components/CarsCard";
import CarSalecard from "../../components/CarSalecard";
import TourismCard from "../../components/TourismCard";
import SpecialOfferCard from "../../components/SpecialOfferCard";
/* =========================
   Navbar component
   ========================= */
function Navbar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);

  // desktop search queries stored in one object (hooks must be top-level)
  const desktopFields = [
    { label: "Services", href: "/services" },
    { label: "Property Rental & Bookings", href: "/propertyrental" },
    { label: "Events", href: "/event" },
    { label: "Transport service", href: "/transport" },
    { label: "Sales", href: "/sales" },
  ];
  const initialQueries = desktopFields.reduce((acc, f) => {
    const key = f.label.toLowerCase().replace(/\s+/g, "-");
    acc[key] = "";
    return acc;
  }, {});
  const [desktopQueries, setDesktopQueries] = useState(initialQueries);

  useEffect(() => {
    // keep dark mode classes if needed
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

  const handleDesktopSearchClick = () => {
    let targetHref = "/services";
    let queryParam = "";

    for (const field of desktopFields) {
      const key = field.label.toLowerCase().replace(/\s+/g, "-");
      const value = desktopQueries[key];
      if (value && value.trim() !== "") {
        targetHref = field.href;
        queryParam = value.trim();
        break;
      }
    }

    const url = queryParam
      ? `${targetHref}?q=${encodeURIComponent(queryParam)}`
      : targetHref;
    window.location.href = url;
  };

  return (
    <>
      {/* ==== FULL HEADER ==== */}
      <header className="relative flex w-full top-0 z-40 flex-col overflow-hidden">
        {/* Background */}
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
            {/* Desktop Links (removed auth/login) */}

            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link href="/listProperty">
                <button className="text-white/90 hover:text-white hover:underline transition-all duration-300 relative group">
                  List your property
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              </Link>

              <Link href="/auth/profile">
                <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-full text-white/95 hover:bg-white/10 transition-all duration-300">
                  <span className="w-6 h-6 inline-flex items-center justify-center bg-white/10 rounded-full">
                    <User className="w-4 h-4 text-white" />
                  </span>
                  <span className="hidden md:inline text-sm">Account</span>
                </button>
              </Link>

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
          <div className="w-full max-w-6xl hidden sm:block px-4 sm:px-0 mt-0">
            <div className="flex flex-col md:flex-row items-stretch border justify-center text-center rounded-2xl md:rounded-full shadow-2xl p-4 md:px-8 md:py-4 bg-white/95 dark:bg-gray-800/95 dark:border-gray-600 backdrop-blur-xl gap-y-3 md:gap-y-0 hover:shadow-3xl transition-all duration-300">
              {desktopFields.map((field, i) => {
                const key = field.label.toLowerCase().replace(/\s+/g, "-");
                return (
                  <div
                    key={i}
                    className={`flex flex-col px-3 sm:px-5 ${
                      i < desktopFields.length - 1
                        ? "sm:border-r dark:border-gray-600"
                        : ""
                    }`}
                  >
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      {field.label}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={desktopQueries[key]}
                        onChange={(e) =>
                          setDesktopQueries((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="bg-transparent outline-none text-sm text-gray-700 dark:text-white flex-1"
                        id={`search-${key}`}
                      />
                    </div>
                  </div>
                );
              })}

              {/* === Desktop Search Icon Button === */}
              <div className="flex items-center justify-center px-3">
                <button
                  onClick={handleDesktopSearchClick}
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
          // account now points to /account within this unified page ecosystem
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
        </div>
      )}

      {/* Spacer so bottom nav doesn’t overlap content */}
      <div className="sm:hidden pt-4 pb-20" />
    </>
  );
}

/* =========================
   ProductsSection component
   (unchanged logic, placed here)
   ========================= */
function ProductsSection() {
  const [properties, setProperties] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${baseUrl}/admin/properties`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.properties || [];

      const formattedData = data.map((item) => {
        let firstImage =
          Array.isArray(item.imageUrl) && item.imageUrl.length > 0
            ? item.imageUrl[0]
            : typeof item.imageUrl === "string"
            ? item.imageUrl
            : null;

        const imageSrc = firstImage
          ? firstImage.startsWith("http")
            ? firstImage
            : `${baseUrl}${firstImage.startsWith("/") ? "" : "/"}${firstImage}`
          : null;

        return { ...item, imageUrl: imageSrc };
      });

      setProperties(formattedData);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching properties:", err);
      setProperties([]);
      setError("Unable to fetch properties. Please try again later.");
    }
  };

  const fetchSpecialOffers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/special-offers`);
      const data = Array.isArray(res.data) ? res.data : [];

      const formattedData = data
        .filter((offer) => offer.status === "approved")
        .map((item) => {
          let firstImage =
            Array.isArray(item.imageUrl) && item.imageUrl.length > 0
              ? item.imageUrl[0]
              : typeof item.imageUrl === "string"
              ? item.imageUrl
              : null;

          const imageSrc = firstImage
            ? firstImage.startsWith("http")
              ? firstImage
              : `${baseUrl}${
                  firstImage.startsWith("/") ? "" : "/"
                }${firstImage}`
            : null;

          return { ...item, imageUrl: imageSrc };
        })
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

      setSpecialOffers(formattedData);
    } catch (err) {
      console.error("❌ Error fetching special offers:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProperties(), fetchSpecialOffers()]);
      setLoading(false);
    };
    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading properties...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  const popularStays = properties.filter(
    (p) =>
      ["apartment", "villa", "guesthouse"].includes(
        (p.serviceType || "").toLowerCase()
      ) && p.status === "approved"
  );

  const carsForRent = properties.filter(
    (p) =>
      (p.serviceType || "").toLowerCase() === "car" &&
      p.listingType === "rent" &&
      p.status === "approved"
  );

  const tourismSites = properties.filter(
    (p) =>
      (p.serviceType || "").toLowerCase() === "tourism" &&
      p.status === "approved"
  );

  const housesForSale = properties.filter(
    (p) =>
      (p.serviceType || "").toLowerCase() === "house" &&
      p.listingType === "sale" &&
      p.status === "approved"
  );

  const carsForSale = properties.filter(
    (p) =>
      (p.serviceType || "").toLowerCase() === "car" &&
      p.listingType === "sale" &&
      p.status === "approved"
  );

  const renderHorizontalScroll = (items, CardComponent) => (
    <div className="relative overflow-hidden">
      <div className="flex gap-3 xs:gap-4 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-2 px-1">
        {items.map((listing) => (
          <div
            key={listing._id}
            className="snap-start flex-shrink-0 w-56 xs:w-60 sm:w-64 md:w-72 lg:w-80 relative"
          >
            <CardComponent {...listing} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 pt-6 xs:pt-8 pb-20 xs:pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile & Tablet Top Rated Offers */}
      {specialOffers.length > 0 && (
        <div className="mb-6 xs:mb-16 block lg:hidden">
          <div className="text-center mb-6 xs:mb-8 px-2">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
              ✨ Top Rated Offers
            </h2>
            <div className="w-20 xs:w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex gap-3 xs:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-2 px-1">
            {specialOffers.slice(0, 3).map((offer) => (
              <div
                key={offer._id}
                className="snap-start flex-shrink-0 w-64 xs:w-72 sm:w-80 md:w-96"
              >
                <SpecialOfferCard {...offer} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Special Offers */}
      {specialOffers.length > 0 && (
        <div className="mb-16 hidden lg:block">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              ✨ Top Rated Offers
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {specialOffers.slice(0, 3).map((offer) => (
              <SpecialOfferCard key={offer._id} {...offer} />
            ))}
          </div>
        </div>
      )}

      {/* Other sections */}
      {popularStays.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🏨 Hotel Rooms
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(popularStays, ProductCard)}
        </div>
      )}

      {carsForRent.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🔍 Cars for Rental
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(carsForRent, CarsCard)}
        </div>
      )}

      {tourismSites.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              🏞️ Tourism Sites in Ethiopia
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(tourismSites, TourismCard)}
        </div>
      )}

      {housesForSale.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              🏠 Houses for Sale
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(housesForSale, HousesCard)}
        </div>
      )}

      {carsForSale.length > 0 && (
        <div className="mb-12 xs:mb-16">
          <div className="mb-6 xs:mb-8 px-2">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🚗 Cars for Sale
            </h2>
            <div className="w-16 xs:w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></div>
          </div>
          {renderHorizontalScroll(carsForSale, CarSalecard)}
        </div>
      )}
    </section>
  );
}

/* =========================
   Profile Section
   (simple profile info block)
   ========================= */

/* =========================
   Footer
   ========================= */
function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 text-sm border-t border-gray-700/50 mt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-8 xs:py-10 sm:py-12">
        {/* Top Section: Footer Columns */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 xs:gap-8 pb-8 xs:pb-10 sm:pb-12 text-center xs:text-left sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/aboutus"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  How Blue Nile PLC works
                </a>
              </li>

              <li>
                <a
                  href="/auth/login"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Blue Nile Plus
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Community
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  This is a real site
                </a>
              </li>
              <div className="flex justify-center sm:justify-start gap-4 xs:gap-6 pb-6 xs:pb-8">
                <a
                  href="https://www.tiktok.com/@bluenile32?_t=ZM-8ywz8okk59J&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-blue-500/10"
                >
                  <FaTiktok className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
                <a
                  href="https://x.com/BlueNile374131?t=p0q0DtyhwBVfQwIysudJXQ&s=35"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-sky-500/10"
                >
                  <FaXTwitter className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
                <a
                  href="https://www.instagram.com/blue.nile66?utm_source=qr&igsh=MWE0enpybWRqa2k2dQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-pink-500/10"
                >
                  <Instagram className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>{" "}
                <a
                  href="https://www.linkedin.com/groups/13354352"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-blue-500/10"
                >
                  <Linkedin className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
                <a
                  href="https://youtube.com/@bluenile-z8t?si=Gyhp8MsqaPwvaCoO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-all duration-300 hover:scale-125 p-2 rounded-full hover:bg-red-500/10"
                >
                  <Youtube className="h-5 w-5 xs:h-6 xs:w-6" />
                </a>
              </div>
            </ul>
          </div>

          {/* Host */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Host
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/listProperty"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Become a Host
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Blue Nile for Work
                </a>
              </li>
              <li>
                <a
                  href="/listProperty"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Host resources
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-3 xs:mb-4 text-base xs:text-lg bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Support
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/cancellation"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Cancellation options
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Neighborhood Support
                </a>
              </li>
              <li>
                <a
                  href="/auth/login"
                  className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                >
                  Trust & Safety
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-700/50 pt-6 xs:pt-8 gap-3 xs:gap-4 text-center sm:text-left">
          <p className="text-xs xs:text-sm text-gray-400">
            © {new Date().getFullYear()} Blue Nile PLC · Privacy · Terms ·
            Sitemap
          </p>
          <div className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-6 text-xs xs:text-sm">
            <span className="cursor-pointer hover:text-blue-400 transition-colors duration-300">
              English (EN)
            </span>
            <span className="cursor-pointer hover:text-blue-400 transition-colors duration-300">
              ETB (Birr)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================
   Page (combined)
   ========================= */
export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Profile info near top of main content */}

        {/* Products and other sections */}
        <ProductsSection />
      </main>

      <Footer />
    </div>
  );
}
