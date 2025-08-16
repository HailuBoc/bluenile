"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[650px]">
        <Image
          src="/logo.jpg" // Replace with your own image
          alt="About Us Background"
          fill
          className="object-cover h-screen"
          priority
        />
      </section>

      {/* Company Intro */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Who We Are
        </h2>
        <p className="text-lg leading-relaxed text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We are a modern accommodation and hosting platform built with a
          passion for connecting travelers and hosts across the globe. Our
          mission is simple — to make booking stays, hosting guests, and
          exploring new destinations effortless, affordable, and unforgettable.
        </p>
      </section>

      {/* Our Mission */}
      <section className="bg-blue-50 dark:bg-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We believe that travel should bring people together. Our platform
            empowers hosts to share their spaces and allows travelers to
            discover unique stays that match their style, budget, and needs.
            From cozy city apartments to serene countryside escapes, we connect
            you to a world of possibilities.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow rounded-xl p-8 text-center border border-gray-100 dark:border-gray-600"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-8 text-lg">
            Have questions, feedback, or partnership inquiries? We’re here to
            help. Drop us a message and we’ll get back to you soon.
          </p>
          <a
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-gray-100 transition font-medium"
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
