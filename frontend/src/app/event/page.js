"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Heart, Cake, GraduationCap, Briefcase } from "lucide-react";

export default function EventServices() {
  const [search, setSearch] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);

  const eventCategories = [
    {
      title: "Weddings",
      subtitle: "Traditional | Modern | Religious",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      link: "/event/weddings",
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
      icon: <Cake className="w-8 h-8 text-yellow-500" />,
      link: "/event/birthday",
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
      icon: <GraduationCap className="w-8 h-8 text-green-500" />,
      link: "/event/graduation",
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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold">Event Services Overview</h1>
        <p className="mt-3 text-lg max-w-2xl mx-auto">
          Complete solutions for weddings, parties, graduations, corporate
          meetings, and more.
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex flex-col sm:flex-row items-stretch border justify-center text-center rounded-xl sm:rounded-full shadow-lg p-4 sm:px-8 sm:py-3 bg-white/90 dark:bg-gray-800/90 dark:border-gray-600 gap-y-4 sm:gap-y-0">
          <div className="flex flex-col px-3 sm:px-5 sm:border-r dark:border-gray-600 w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Search
            </label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search for a service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col px-3 sm:px-5 sm:border-r dark:border-gray-600 w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Event Date
            </label>
            <div className="flex items-center">
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col px-3 sm:px-5 sm:border-r dark:border-gray-600 w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
              End Date
            </label>
            <div className="flex items-center">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-col px-3 sm:px-5 w-full sm:w-auto">
            <label className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-semibold">
              Guests
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent outline-none text-sm sm:text-base text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button className="text-blue-600 hover:text-blue-700 p-1 flex items-center justify-center">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition p-6 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                {cat.icon}
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {cat.title}
                  </h3>
                  {cat.subtitle && (
                    <p className="text-gray-500 text-sm">{cat.subtitle}</p>
                  )}
                </div>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {cat.services.map((service, i) => (
                  <li key={i} className="text-sm">
                    {service}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-3">Plan Your Perfect Event</h2>
        <p className="mb-6">
          Let our team handle every detail, from planning to execution.
        </p>
        <Link href={"/event/quote"}>
          <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Get a Quote
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center text-sm">
        &copy; {new Date().getFullYear()} Event Services. All rights reserved.
      </footer>
    </div>
  );
}
