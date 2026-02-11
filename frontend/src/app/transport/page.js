"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Briefcase, MapPin, Sparkles, Home } from "lucide-react";
import axios from "axios";
import Footer from "../../components/Footer";
import DarkModeToggle from "../../components/DarkModeToggle";
import AnimatedCard from "../../components/AnimatedCard";
import CustomButton from "../../components/CustomButton";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

function TransportServicesContent() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [searchData, setSearchData] = useState({
    start: "",
    end: "",
    date: "",
    guests: 1,
  });

  const router = useRouter();
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  // Fetch approved transports
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${baseUrl}/transportpost`);
        const approved = res.data.filter((v) => v.status === "approved");
        setVehicles(approved);
      } catch (err) {
        console.error("❌ Error fetching transport:", err);
        setError("Failed to load transport data");
      }
    };
    fetchVehicles();
  }, []);

  // Filter search
  const filteredFleet = useMemo(() => {
    const start = (searchData.start || "").toLowerCase();
    const end = (searchData.end || "").toLowerCase();

    return vehicles.filter((v) => {
      const name = (v.vehicleName || "").toLowerCase();
      const type = (v.vehicleType || "").toLowerCase();

      return (
        name.includes(start) ||
        name.includes(end) ||
        type.includes(start) ||
        type.includes(end)
      );
    });
  }, [vehicles, searchData.end, searchData.start]);

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
                Transport Services
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

      <motion.header
        className="relative overflow-hidden py-16 xs:py-20 sm:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Transport Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Car rentals with drivers for daily or monthly use. Executive cars
              and vans for tours, events, and corporate needs.
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
          <AnimatedCard className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Start Point
                </label>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={searchData.start}
                  onChange={(e) =>
                    setSearchData({ ...searchData, start: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  End Point
                </label>
                <input
                  type="text"
                  placeholder="Enter drop-off location"
                  value={searchData.end}
                  onChange={(e) =>
                    setSearchData({ ...searchData, end: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) =>
                    setSearchData({ ...searchData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  value={searchData.guests}
                  onChange={(e) =>
                    setSearchData({ ...searchData, guests: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-end">
                <CustomButton
                  onClick={() => console.log("Searching:", searchData)}
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

        {error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
              Our Fleets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredFleet.length > 0 ? (
                  filteredFleet.map((vehicle, idx) => (
                    <AnimatedCard
                      key={vehicle._id}
                      href={`/transport/${vehicle._id}`}
                      delay={idx * 0.05}
                      className="h-full"
                    >
                      <div className="h-full flex flex-col">
                        {vehicle.img ? (
                          <img
                            src={`${baseUrl}/uploads/${vehicle.img}`}
                            alt={vehicle.vehicleName}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-44 object-cover"
                          />
                        ) : (
                          <div className="w-full h-44 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            No Image
                          </div>
                        )}
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">
                            {vehicle.vehicleName}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-center text-sm mt-2">
                            {vehicle.description}
                          </p>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold text-center mt-3">
                            {vehicle.price} ETB
                          </p>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No matching vehicles found.
                  </p>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-14">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
                Why Ride With Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Highlight
                  title="Daily, Weekly & Monthly Rentals"
                  desc="Flexible rental periods to match your schedule."
                  icon={<CalendarIcon />}
                />
                <Highlight
                  title="Professional Drivers"
                  desc="Experienced and courteous drivers at your service."
                  icon={<Briefcase className="w-6 h-6 text-indigo-600" />}
                />
                <Highlight
                  title="City & Outstation Tours"
                  desc="From city sightseeing to long-distance trips, we've got you covered."
                  icon={<MapPin className="w-6 h-6 text-red-600" />}
                />
              </div>
            </div>

            <motion.div
              className="flex justify-center mt-14"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <CustomButton
                onClick={() => router.push("/aboutus")}
                variant="primary"
                size="lg"
              >
                Get a Quote
              </CustomButton>
            </motion.div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}

function Highlight({ title, desc, icon }) {
  return (
    <AnimatedCard hoverEffect={false} className="p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-400">{desc}</p>
    </AnimatedCard>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-6 h-6 text-yellow-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3m-10 0v2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

export default function TransportServices() {
  return (
    <DarkModeProvider>
      <TransportServicesContent />
    </DarkModeProvider>
  );
}
