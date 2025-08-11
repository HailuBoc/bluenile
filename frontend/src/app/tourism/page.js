"use client";
import { Map, Mountain, Landmark, Building, Search } from "lucide-react";
import { useState } from "react";

export default function TourismEthiopia() {
  const [search, setSearch] = useState("");

  const tours = [
    {
      category: "Historic Northern Route",
      icon: <Landmark className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />,
      destinations: [
        "Lalibela – The world-famous rock-hewn churches",
        "Gondar – Castles of Ethiopian emperors",
        "Axum – Ancient obelisks and religious heritage",
        "Bahir Dar & Lake Tana – Monasteries and the Blue Nile Falls",
      ],
    },
    {
      category: "Natural Wonders & Adventure",
      icon: <Mountain className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />,
      destinations: [
        "Simien Mountains – Trekking and wildlife",
        "Bale Mountains – High-altitude nature experiences",
        "Danakil Depression – One of the hottest places on Earth",
        "Sof Omar Caves – One of Africa's largest cave systems",
      ],
    },
    {
      category: "Cultural & Southern Ethiopia",
      icon: <Map className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />,
      destinations: [
        "Omo Valley – Unique ethnic cultures",
        "Hawassa – Lakeside relaxation",
        "Arba Minch – Twin lakes and National Park",
      ],
    },
    {
      category: "City Tours",
      icon: <Building className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />,
      destinations: [
        "Addis Ababa – Museums, Unity Park, Entoto Park, and local cuisine",
      ],
    },
  ];

  const filteredTours = tours.filter(
    (tour) =>
      tour.category.toLowerCase().includes(search.toLowerCase()) ||
      tour.destinations.some((dest) =>
        dest.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-red-700 to-yellow-600 text-white py-12 px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
          Tourism Services – Explore Ethiopia
        </h1>
        <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto">
          Tailor-made tours across Ethiopia, from historic routes to cultural
          and natural destinations.
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 mb-6">
        <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-sm sm:text-base outline-none"
          />
        </div>
      </div>

      {/* Tour Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">
          Top Ethiopian Tourist Destinations
        </h2>
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredTours.map((tour, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  {tour.icon}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {tour.category}
                  </h3>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm sm:text-base">
                  {tour.destinations.map((dest, idx) => (
                    <li key={idx}>{dest}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            No matching tours found.
          </p>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-10 sm:py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Plan Your Ethiopian Adventure
          </h2>
          <p className="mb-4 text-sm sm:text-lg">
            Whether you’re local, international, or part of the diaspora, we’ll
            help you explore Ethiopia.
          </p>
          <button className="bg-white text-green-700 font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow hover:bg-gray-100 transition text-sm sm:text-base">
            Book a Tour
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center mt-8 text-sm sm:text-base">
        <p>
          &copy; {new Date().getFullYear()} Explore Ethiopia Tours. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
