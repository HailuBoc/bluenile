"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Home, BadgeDollarSign } from "lucide-react";
import Link from "next/link";
import SaleSection from "../../components/SaleSection";
import Footer from "../../components/Footer";
import DarkModeToggle from "../../components/DarkModeToggle";
import AnimatedCard from "../../components/AnimatedCard";
import CustomButton from "../../components/CustomButton";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

function SalesContent() {
  const highlights = [
    "Verified listings from trusted owners and companies",
    "Fair and transparent pricing",
    "Direct communication with sellers",
    "Regularly updated offers",
  ];

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
                Sales Listings
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
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-blue-500/10 dark:from-yellow-500/20 dark:via-orange-500/20 dark:to-blue-500/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Sales Listings
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Verified listings of apartments, houses, lands, and vehicles for
              sale — direct from trusted owners or companies.
            </p>
          </motion.div>
        </div>
      </motion.header>

      {/* Listings (Dynamic with Images) */}
      <SaleSection />

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
            Why Buy With Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <AnimatePresence>
              {highlights.map((item, idx) => (
                <AnimatedCard key={idx} delay={idx * 0.1} hoverEffect={false}>
                  <div className="p-5 text-gray-700 dark:text-gray-300">
                    {item}
                  </div>
                </AnimatedCard>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedCard className="p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Find Your Perfect Property or Vehicle Today
          </h2>
          <p className="mb-6 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Explore our verified listings and deal directly with trusted sellers.
          </p>
          <CustomButton
            href={"/sales/postSale"}
            variant="primary"
            size="lg"
            icon={<BadgeDollarSign className="w-5 h-5" />}
          >
            Browse All Listings
          </CustomButton>
        </AnimatedCard>
      </section>

      <Footer />
    </div>
  );
}

export default function Sales() {
  return (
    <DarkModeProvider>
      <SalesContent />
    </DarkModeProvider>
  );
}
