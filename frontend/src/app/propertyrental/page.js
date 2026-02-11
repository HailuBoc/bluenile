"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Search, Sparkles, Home } from "lucide-react";
import Link from "next/link";
import Footer from "../../components/Footer";
import DarkModeToggle from "../../components/DarkModeToggle";
import CustomButton from "../../components/CustomButton";
import AnimatedCard from "../../components/AnimatedCard";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

function PropertyRentalContent() {
  const [properties, setProperties] = useState([]);
  const [destination, setDestination] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:10000";

  // ✅ Fetch approved rentals from backend
  const fetchProperties = async () => {
    try {
      const res = await fetch(`${backendUrl}/propertyrental`);
      const data = await res.json();

      // Filter only approved rentals and add full image URLs
      const approvedRentals = data
        .filter((p) => p.status === "approved")
        .map((item) => ({
          ...item,
          img: item.img ? `${backendUrl}/uploads/${item.img}` : null,
        }));

      setProperties(approvedRentals);
    } catch (err) {
      console.error("❌ Error fetching properties:", err);
      setProperties([]);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ Filter properties by destination and type
  const filteredProperties = useMemo(() => {
    const destinationQuery = destination.trim().toLowerCase();
    const typeQuery = propertyType.trim().toLowerCase();

    return properties.filter((property) => {
      const title = (property.title || "").toLowerCase();
      const location = (property.location || "").toLowerCase();
      const type = (property.type || "").toLowerCase();

      const matchesDestination =
        !destinationQuery ||
        title.includes(destinationQuery) ||
        location.includes(destinationQuery);

      const matchesType = !typeQuery || type === typeQuery;

      return matchesDestination && matchesType;
    });
  }, [properties, destination, propertyType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Property Rentals
              </h1>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <DarkModeToggle />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.header
        className="relative overflow-hidden py-16 xs:py-20 sm:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-indigo-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Property Rentals & Bookings
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Houses, apartments, guesthouses, hotel apartments — all in one
              place.
            </p>
          </motion.div>
        </div>
      </motion.header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          className="max-w-6xl mx-auto mb-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Search Bar */}
          <AnimatedCard className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="City, landmark, or address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Guesthouse">Guesthouse</option>
                  <option value="Hotel Apartment">Hotel Apartment</option>
                </select>
              </div>

              <div className="flex items-end">
                <CustomButton
                  onClick={() =>
                    console.log("Searching:", { destination, propertyType })
                  }
                  variant="primary"
                  size="md"
                  className="w-full"
                  icon={<Search className="w-5 h-5" />}
                >
                  Search
                </CustomButton>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <AnimatedCard
                  key={property._id}
                  delay={index * 0.05}
                  className="h-full"
                  hoverEffect={true}
                >
                  <div className="h-full flex flex-col">
                    {property.img ? (
                      <img
                        src={property.img}
                        alt={property.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {property.type}
                      </p>

                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </p>

                      <p className="text-blue-600 dark:text-blue-400 font-bold mt-3">
                        {property.price}
                      </p>

                      <div className="mt-4">
                        <CustomButton
                          href={`/propertyrental/${property._id}`}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          Book Now
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 mt-10">
                No rental properties found.
              </p>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function PropertyRentalPage() {
  return (
    <DarkModeProvider>
      <PropertyRentalContent />
    </DarkModeProvider>
  );
}
