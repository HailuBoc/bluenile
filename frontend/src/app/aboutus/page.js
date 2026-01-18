// ...existing code...
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Home, Info, Sparkles } from "lucide-react";
import Link from "next/link";
import AnimatedCard from "../../components/AnimatedCard";
import CustomButton from "../../components/CustomButton";
import DarkModeToggle from "../../components/DarkModeToggle";
import Footer from "../../components/Footer";
import { DarkModeProvider } from "../../contexts/DarkModeContext";

function AboutContent() {
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
                About Us
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
      {/* Hero Section */}
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[520px] xl:h-[560px] overflow-hidden rounded-b-xl">
        <div className="absolute inset-0">
          <Image
            src="/logo.jpg"
            alt="About Us Background"
            fill
            sizes="100vw"
            className="object-contain md:object-cover object-center md:object-[center_25%]" // moves image slightly upward
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-transparent dark:from-black/60 dark:via-black/40 rounded-b-xl" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white drop-shadow-lg">
              About Blue Nile plc
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connecting travelers and hosts across the globe — effortless,
              affordable, and unforgettable stays.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <CustomButton href="/contact" variant="primary" size="md">
                Contact Us
              </CustomButton>
              <CustomButton href="/listProperty" variant="ghost" size="md">
                List Your Property
              </CustomButton>
            </div>
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <AnimatedCard className="p-6 md:p-10" hoverEffect={false}>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
            Who We Are
          </h2>
          <p className="text-lg leading-relaxed text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We are a modern accommodation and hosting platform built with a
            passion for connecting travelers and hosts across the globe. Our
            mission is simple — to make booking stays, hosting guests, and
            exploring new destinations effortless, affordable, and
            unforgettable.
          </p>
        </AnimatedCard>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedCard className="p-6 md:p-10" hoverEffect={false}>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We believe that travel should bring people together. Our platform
              empowers hosts to share their spaces and allows travelers to
              discover unique stays that match their style, budget, and needs.
              From cozy city apartments to serene countryside escapes, we
              connect you to a world of possibilities.
            </p>
          </AnimatedCard>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Trust & Safety",
              desc: "We prioritize secure transactions, verified hosts, and safe experiences for everyone.",
              icon: "🔒",
            },
            {
              title: "Community",
              desc: "We build connections between travelers and locals, fostering cultural exchange and friendships.",
              icon: "🌍",
            },
            {
              title: "Innovation",
              desc: "We leverage cutting-edge technology to make booking and hosting easier than ever.",
              icon: "💡",
            },
          ].map((value, index) => (
            <AnimatedCard key={index} className="p-6 md:p-8 text-center" hoverEffect={true}>
              <div className="text-5xl mb-4 transform transition-transform hover:scale-105">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {value.desc}
              </p>
            </AnimatedCard>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatedCard className="p-8 text-center" hoverEffect={false}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
              Get in Touch
            </h2>
          </div>
          <p className="mb-6 text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Have questions, feedback, or partnership inquiries? We’re here to
            help. Drop us a message and we’ll get back to you soon.
          </p>
          <CustomButton href="/contact" variant="primary" size="lg">
            Contact Us
          </CustomButton>
        </AnimatedCard>
      </section>

      <Footer />
    </div>
  );
}

export default function AboutPage() {
  return (
    <DarkModeProvider>
      <AboutContent />
    </DarkModeProvider>
  );
}
// ...existing code...
