"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Cake,
  GraduationCap,
  Briefcase,
  Search,
  Crown,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import Footer from "../../../components/Footer";
import DarkModeToggle from "../../../components/DarkModeToggle";
import CustomButton from "../../../components/CustomButton";
import AnimatedCard from "../../../components/AnimatedCard";
import { DarkModeProvider } from "../../../contexts/DarkModeContext";

function VIPEventsContent() {
  const [search, setSearch] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const vipEventCategories = [
    {
      title: "Luxury Weddings",
      subtitle: "VIP Wedding Packages",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      link: "/event/vipevent/weddings",
      gradient: "from-pink-500 to-rose-500",
      services: [
        "Exclusive Wedding Hall",
        "Professional Photography & Videography",
        "Gourmet Catering (Food & Drinks)",
        "Luxury Decoration",
        "DJ & Entertainment",
        "VIP Car Service",
        "Guest Management & Concierge",
      ],
    },
    {
      title: "Luxury Birthday Parties",
      subtitle: "VIP Birthday Packages",
      icon: <Cake className="w-8 h-8 text-yellow-500" />,
      link: "/event/vipevent/birthday",
      gradient: "from-yellow-500 to-orange-500",
      services: [
        "Luxury Hall",
        "Photography & Videography",
        "Gourmet Catering",
        "Premium Decoration",
        "DJ & Entertainment",
        "VIP Car Service",
        "Guest Management",
      ],
    },
    {
      title: "Luxury Graduations",
      subtitle: "VIP Graduation Packages",
      icon: <GraduationCap className="w-8 h-8 text-green-500" />,
      link: "/event/vipevent/graduation",
      gradient: "from-green-500 to-emerald-500",
      services: [
        "Luxury Hall",
        "Professional Photography & Videography",
        "Catering",
        "Luxury Decoration",
        "DJ & Entertainment",
        "VIP Car Service",
        "Guest Management",
      ],
    },
    {
      title: "Luxury Corporate & General Events",
      subtitle: "VIP Corporate Packages",
      icon: <Briefcase className="w-8 h-8 text-blue-500" />,
      link: "/event/vipevent/generalevents",
      gradient: "from-blue-500 to-indigo-500",
      services: [
        "Luxury Event Hall / Meeting Room",
        "Audio-Visual Setup (Projectors, Screens, Microphones)",
        "Professional Photography & Videography",
        "Gourmet Catering",
        "Luxury Decoration & Branding",
        "Event Coordinator & VIP Staff",
        "VIP Transportation Service",
        "Guest Management & Registration",
      ],
    },
  ];

  const filteredCategories = vipEventCategories.filter(
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
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                VIP Event Services
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 dark:from-yellow-500/20 dark:via-orange-500/20 dark:to-red-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              VIP Event Services
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Exclusive, luxury services for weddings, birthdays, graduations, and
              corporate events.
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
                Search VIP Services
              </label>
              <input
                type="text"
                placeholder="Search for a VIP service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
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
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
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
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </AnimatedCard>
      </motion.section>

      {/* Back to Regular Events Button */}
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
          href="/event"
          variant="secondary"
          size="lg"
          icon={<Sparkles className="w-6 h-6" />}
        >
          Back to Regular Events
        </CustomButton>
      </motion.div>

      {/* VIP Event Categories Grid */}
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
                      VIP Services Included
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
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex-shrink-0" />
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

      {/* CTA Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <AnimatedCard className="p-8 sm:p-12 text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Plan Your VIP Event
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Get in touch to make your event unforgettable with our VIP services.
          </p>
          <CustomButton
            href="/event/quote"
            variant="accent"
            size="lg"
            icon={<Crown className="w-6 h-6" />}
          >
            Request a VIP Service
          </CustomButton>
        </AnimatedCard>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Main component with dark mode provider
export default function VIPEvents() {
  return (
    <DarkModeProvider>
      <VIPEventsContent />
    </DarkModeProvider>
  );
}
