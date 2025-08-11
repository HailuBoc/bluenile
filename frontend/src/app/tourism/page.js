"use client";
import { Map, Mountain, Landmark, Building, Search } from "lucide-react";
import { useState } from "react";

export default function TourismEthiopia() {
  const [search, setSearch] = useState("");

  const tours = [
    {
      category: "Historic Northern Route",
      icon: <Landmark className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />,
      destinations: [
        "Lalibela – The world-famous rock-hewn churches",
        "Gondar – Castles of Ethiopian emperors",
        "Axum – Ancient obelisks and religious heritage",
        "Bahir Dar & Lake Tana – Monasteries and the Blue Nile Falls",
      ],
    },
    {
      category: "Natural Wonders & Adventure",
      icon: <Mountain className="w-6 h-6 md:w-8 md:h-8 text-green-600" />,
      destinations: [
        "Simien Mountains – Trekking and wildlife",
        "Bale Mountains – High-altitude nature experiences",
        "Danakil Depression – One of the hottest places on Earth",
        "Sof Omar Caves – One of Africa's largest cave systems",
      ],
    },
    {
      category: "Cultural & Southern Ethiopia",
      icon: <Map className="w-6 h-6 md:w-8 md:h-8 text-pink-600" />,
      destinations: [
        "Omo Valley – Unique ethnic cultures",
        "Hawassa – Lakeside relaxation",
        "Arba Minch – Twin lakes and National Park",
      ],
    },
    {
      category: "City Tours",
      icon: <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      destinations: [
        "Addis Ababa – Museums, Unity Park, Entoto Park, and local cuisine",
      ],
    },
  ];

  // Filter tours by search
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
      <header className="bg-gradient-to-r from-red-700 to-yellow-600 text-white py-12 md:py-16 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          Tourism Services – Explore Ethiopia
        </h1>
        <p className="mt-4 text-base md:text-xl max-w-3xl mx-auto px-2 md:px-0">
          Tailor-made tours across Ethiopia, from historic routes to cultural
          and natural destinations. Services for local and international
          travelers, with a special focus on the Ethiopian diaspora.
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 md:-mt-8 mb-8">
        <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden">
          <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="What to visit?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 md:px-4 md:py-3 outline-none text-sm md:text-base"
          />
        </div>
      </div>

      {/* Tour Categories */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-800 text-center">
          Top Ethiopian Tourist Destinations
        </h2>
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {filteredTours.map((tour, index) => (
              <div
                key={index}
                className="bg-white p-4 md:p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  {tour.icon}
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">
                    {tour.category}
                  </h3>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-1 md:space-y-2 text-sm md:text-base">
                  {tour.destinations.map((dest, idx) => (
                    <li key={idx}>{dest}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No matching tours or destinations found.
          </p>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-10 md:py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Plan Your Ethiopian Adventure Today
          </h2>
          <p className="mb-5 md:mb-6 text-base md:text-lg">
            Whether you’re a local, an international traveler, or part of the
            Ethiopian diaspora, we’ll help you explore the beauty and heritage
            of Ethiopia.
          </p>
          <button className="bg-white text-green-700 font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-base">
            Book a Tour
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 md:py-8 text-center mt-10 text-sm md:text-base">
        <p>
          &copy; {new Date().getFullYear()} Explore Ethiopia Tours. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
