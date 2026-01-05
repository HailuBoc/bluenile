"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Cake, GraduationCap, Briefcase, Search } from "lucide-react";
import Footer from "../../../components/Footer";

export default function VIPEvents() {
  const [search, setSearch] = useState("");
  const [vipEvents, setVipEvents] = useState([
    {
      title: "Luxury Weddings",
      subtitle: "VIP Wedding Packages",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      link: "/event/vipevent/weddings",
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
  ]);

  const filteredEvents = vipEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.services.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-red-700 to-yellow-600 text-white py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">VIP Event Services</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto px-4">
          Exclusive, luxury services for weddings, birthdays, graduations, and
          corporate events.
        </p>
      </header>

      {/* Search */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex items-center bg-white rounded-full shadow-md p-4">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search VIP services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-gray-700 text-sm md:text-base"
          />
        </div>
      </div>

      {/* VIP Event Cards */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map((event, idx) => (
            <Link
              key={idx}
              href={event.link}
              className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition p-6 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                {event.icon}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="text-gray-500 text-sm md:text-base">
                      {event.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm md:text-base">
                {event.services.map((service, i) => (
                  <li key={i}>{service}</li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-600 text-white py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Plan Your VIP Event
        </h2>
        <p className="mb-6 text-lg md:text-xl">
          Get in touch to make your event unforgettable with our VIP services.
        </p>
        <Link href="/event/quote">
          <button className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-sm md:text-base">
            Request a VIP Service
          </button>
        </Link>
      </section>
      <div>
        <Footer />
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center text-sm md:text-base">
        &copy; {new Date().getFullYear()} VIP Event Services. All rights
        reserved.
      </footer>
    </div>
  );
}
