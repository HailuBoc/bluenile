"use client";
import { useState } from "react";
import { Car, Bus, Briefcase, MapPin, Search } from "lucide-react";

export default function TransportServices() {
  const [searchTerm, setSearchTerm] = useState("");

  const fleet = [
    {
      title: "Luxury Sedan",
      description:
        "Executive comfort for business or VIP travel with a professional driver.",
      icon: <Car className="w-10 h-10 text-blue-600" />,
      price: "$120 / day",
    },
    {
      title: "SUV / 4x4",
      description:
        "Spacious and powerful, perfect for family trips or adventure tours.",
      icon: <Car className="w-10 h-10 text-green-600" />,
      price: "$150 / day",
    },
    {
      title: "Executive Van",
      description: "Ideal for group travel, events, and corporate shuttles.",
      icon: <Bus className="w-10 h-10 text-purple-600" />,
      price: "$200 / day",
    },
    {
      title: "Tour Bus",
      description:
        "Comfortable large buses for city tours and out-of-town excursions.",
      icon: <Bus className="w-10 h-10 text-pink-600" />,
      price: "Contact for quote",
    },
  ];

  const highlights = [
    {
      title: "Daily & Monthly Rentals",
      desc: "Flexible rental periods to match your schedule.",
      icon: <CalendarIcon />,
    },
    {
      title: "Professional Drivers",
      desc: "Experienced and courteous drivers at your service.",
      icon: <Briefcase className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: "City & Outstation Tours",
      desc: "From city sightseeing to long-distance trips, we've got you covered.",
      icon: <MapPin className="w-6 h-6 text-red-600" />,
    },
  ];

  const filteredFleet = fleet.filter(
    (vehicle) =>
      vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Transport Services</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Car rentals with drivers for daily or monthly use. Executive cars and
          vans for tours, events, and corporate needs.
        </p>
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-5xl mx-auto mt-8 animate-fadeUp animation-delay-300">
        <div className="flex items-center justify-between border rounded-full shadow-lg px-6 py-3 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 dark:border-gray-600">
          {/* Destination */}
          <div className="flex flex-col px-4 border-r dark:border-gray-600 min-w-[150px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              Destination
            </label>
            <input
              type="text"
              placeholder="Where are you going?"
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Check-in */}
          <div className="flex flex-col px-4 border-r dark:border-gray-600 min-w-[120px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              Check-in
            </label>
            <input
              type="date"
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-white"
            />
          </div>
          {/* Check-out */}
          <div className="flex flex-col px-4 border-r dark:border-gray-600 min-w-[120px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              Check-out
            </label>
            <input
              type="date"
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-white"
            />
          </div>
          {/* Guests */}
          <div className="flex flex-col px-4 min-w-[100px]">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              Guests
            </label>
            <input
              type="number"
              min="1"
              placeholder="2 guests"
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          {/* Search Button */}
          <div className="pl-4">
            <Search className="h-8 w-8 text-white bg-blue-600 p-3 rounded-full cursor-pointer shadow-lg" />
          </div>
        </div>
      </div>

      {/* Fleet Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
          Our Fleet
        </h2>
        {filteredFleet.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredFleet.map((vehicle, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="mb-4 flex justify-center">{vehicle.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {vehicle.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {vehicle.description}
                </p>
                <p className="text-blue-600 font-semibold text-center mt-3">
                  {vehicle.price}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No matching vehicles found.
          </p>
        )}
      </section>

      {/* Highlights */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            Why Ride With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-6 rounded-lg shadow-sm hover:shadow-md transition text-center"
              >
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Book Your Ride Today</h2>
          <p className="mb-6 text-lg">
            Reliable transport for business, leisure, and special events —
            anytime, anywhere.
          </p>
          <button className="bg-white text-green-700 font-bold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition">
            Get a Quote
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center mt-10">
        <p>
          &copy; {new Date().getFullYear()} Transport Services. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

// Calendar icon
function CalendarIcon() {
  return (
    <svg
      className="w-6 h-6 text-yellow-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3m-10 0v2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
