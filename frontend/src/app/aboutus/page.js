"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[250px] sm:h-[300px] md:h-[400px]">
        {/* Optional: Background image */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug">
            About Us
          </h1>
        </div>
      </section>

      {/* Company Intro */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Who We Are
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-center mb-8 sm:mb-10">
          We are a modern accommodation and hosting platform, inspired by the
          likes of Airbnb, built with a passion for connecting travelers and
          hosts across the globe. Our mission is simple — to make booking stays,
          hosting guests, and exploring new destinations effortless, affordable,
          and unforgettable.
        </p>
      </section>

      {/* Our Mission */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-center">
            We believe that travel should bring people together. Our platform
            empowers hosts to share their spaces and allows travelers to
            discover unique stays that match their style, budget, and needs.
            From cozy city apartments to serene countryside escapes, we connect
            you to a world of possibilities.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-center">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              title: "Trust & Safety",
              desc: "We prioritize secure transactions, verified hosts, and safe experiences for everyone.",
            },
            {
              title: "Community",
              desc: "We build connections between travelers and locals, fostering cultural exchange and friendships.",
            },
            {
              title: "Innovation",
              desc: "We leverage cutting-edge technology to make booking and hosting easier than ever.",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 shadow-lg rounded-xl p-6 text-center"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                {value.title}
              </h3>
              <p className="text-sm sm:text-base">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base">
            Have questions, feedback, or partnership inquiries? We’re here to
            help. Drop us a message and we’ll get back to you soon.
          </p>
          <a
            href="/contact"
            className="bg-blue-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 sm:py-6 text-sm sm:text-base">
        <p>© {new Date().getFullYear()} Blue Nile plc. All rights reserved.</p>
      </footer>
    </div>
  );
}
