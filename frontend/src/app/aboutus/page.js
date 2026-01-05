// ...existing code...
"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
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
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="/contact"
                className="inline-block bg-white text-blue-700 font-medium py-2.5 px-5 rounded-full shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition"
              >
                Contact Us
              </a>
              <a
                href="/listProperty"
                className="inline-block bg-transparent border border-white/60 text-white/90 py-2.5 px-5 rounded-full hover:bg-white/10 transition"
              >
                List Your Property
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-10 transition hover:shadow-2xl">
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
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-10">
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
          </div>
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
            <div
              key={index}
              className="bg-white dark:bg-gray-700 shadow-lg hover:shadow-2xl transition-shadow rounded-xl p-6 md:p-8 text-center border border-gray-100 dark:border-gray-600"
            >
              <div className="text-5xl mb-4 transform transition-transform hover:scale-105">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Get in Touch
          </h2>
          <p className="mb-6 text-lg max-w-2xl mx-auto">
            Have questions, feedback, or partnership inquiries? We’re here to
            help. Drop us a message and we’ll get back to you soon.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-white/90 transition font-medium shadow"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} Blue Nile plc. All rights reserved.</p>
      </footer>
    </div>
  );
}
// ...existing code...
