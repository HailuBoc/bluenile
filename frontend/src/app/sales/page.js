"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SaleSection from "../../components/SaleSection";

export default function Sales() {
  const highlights = [
    "Verified listings from trusted owners and companies",
    "Fair and transparent pricing",
    "Direct communication with sellers",
    "Regularly updated offers",
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-12 sm:py-16 px-4 sm:px-6 text-center">
        <motion.h1
          className="text-3xl sm:text-5xl font-bold"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Sales Listings
        </motion.h1>
        <motion.p
          className="mt-3 sm:mt-4 text-base sm:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Verified listings of apartments, houses, lands, and vehicles for sale
          — direct from trusted owners or companies.
        </motion.p>
      </header>

      {/* Listings (Dynamic with Images) */}
      <SaleSection />

      {/* Highlights */}
      <section className="bg-white py-10 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
            Why Buy With Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {highlights.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-100 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition text-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 sm:py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Find Your Perfect Property or Vehicle Today
          </motion.h2>
          <motion.p
            className="mb-5 sm:mb-6 text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Explore our verified listings and deal directly with trusted
            sellers.
          </motion.p>
          <Link href={"/sales/postSale"}>
            <motion.button
              className="bg-white text-blue-700 font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow hover:bg-gray-100 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse All Listings
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 sm:py-8 text-center mt-8 sm:mt-10">
        <p>
          &copy; {new Date().getFullYear()} Sales Listings. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
