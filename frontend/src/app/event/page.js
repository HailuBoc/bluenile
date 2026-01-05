"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  Cake,
  GraduationCap,
  Briefcase,
  Crown,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import Footer from "../../components/Footer";
import DarkModeToggle from "../../components/DarkModeToggle";
import CustomButton from "../../components/CustomButton";
import AnimatedCard from "../../components/AnimatedCard";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

function EventServicesContent() {
  const [search, setSearch] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const eventCategories = [
    {
      title: "Weddings",
      subtitle: "Traditional | Modern | Religious",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      link: "/event/wedding",
      gradient: "from-pink-500 to-rose-500",
      services: [
        "Wedding Hall",
        "Photography & Videography",
        "Catering (Food & Drinks)",
        "Decoration",
        "DJ & Entertainment",
        "Car Service (Wedding Transportation)",
        "Guest Management",
      ],
    },
    {
      title: "Birthday Parties",
      subtitle: "Celebrate in style",
      icon: <Cake className="w-8 h-8 text-yellow-500" />,
      link: "/event/birthday",
      gradient: "from-yellow-500 to-orange-500",
      services: [
        "Hall",
        "Photography & Videography",
        "Catering",
        "Decoration",
        "DJ",
        "Car Service",
        "Guest Management",
      ],
    },
    {
      title: "Graduations",
      subtitle: "Academic achievements",
      icon: <GraduationCap className="w-8 h-8 text-green-500" />,
      link: "/event/graduation",
      gradient: "from-green-500 to-emerald-500",
      services: [
        "Hall",
        "Photography & Videography",
        "Catering",
        "Decoration",
        "DJ",
        "Car Service",
        "Guest Management",
      ],
    },
    {
      title: "General Events",
      subtitle: "Meetings, Conferences, Corporate Events",
      icon: <Briefcase className="w-8 h-8 text-blue-500" />,
      link: "/event/generalevents",
      gradient: "from-blue-500 to-indigo-500",
      services: [
        "Event Hall / Meeting Room",
        "Audio-Visual Setup (Projectors, Screens, Microphones)",
        "Photography & Videography",
        "Catering (Snacks, Lunch, Coffee Breaks)",
        "Decoration & Branding (Banners, Backdrops)",
        "Event Coordinator & Staff Support",
        "Transportation Service (VIP Pickup, Shuttle)",
        "Guest Management & Registration Desk",
      ],
    },
  ];

  const filteredCategories = eventCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(search.toLowerCase()) ||
      category.services.some((s) =>
        s.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation Bar with Dark Mode Toggle */}
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
                Event Services
              </h1>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Event Services Overview
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Complete solutions for weddings, parties, graduations, corporate
              meetings, and more.
            </p>
          </motion.div>
        </div>
      </motion.header>

      {/* Search Section */}
      <motion.section
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <AnimatedCard className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Services
              </label>
              <input
                type="text"
                placeholder="Search for a service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </AnimatedCard>
      </motion.section>

      {/* VIP Button */}
      <motion.div
        className="flex justify-center mb-16"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.8,
          type: "spring",
          stiffness: 200,
        }}
      >
        <CustomButton
          href="/event/vipevent"
          variant="accent"
          size="lg"
          icon={<Crown className="w-6 h-6" />}
        >
          VIP Services
        </CustomButton>
      </motion.div>

      {/* Event Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <AnimatedCard
                key={category.title}
                href={category.link}
                delay={index * 0.1}
                className="h-full"
              >
                <div className="p-6 sm:p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className={`p-3 rounded-2xl bg-gradient-to-r ${category.gradient} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      {category.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {category.title}
                      </h3>
                      {category.subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                          {category.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                      Included Services
                    </h4>
                    <ul className="space-y-2">
                      {category.services.map((service, serviceIndex) => (
                        <motion.li
                          key={serviceIndex}
                          className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm sm:text-base"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1 + serviceIndex * 0.05,
                          }}
                        >
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0" />
                          <span>{service}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <motion.div
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                  >
                    <CustomButton
                      href={category.link}
                      variant="primary"
                      size="sm"
                      className="w-full"
                    >
                      Explore {category.title}
                    </CustomButton>
                  </motion.div>
                </div>
              </AnimatedCard>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Main component with dark mode provider
export default function EventServices() {
  return (
    <DarkModeProvider>
      <EventServicesContent />
    </DarkModeProvider>
  );
}
