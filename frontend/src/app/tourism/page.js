"use client";
import {
  Map,
  Mountain,
  Landmark,
  Building,
  Search,
  Calendar,
  X,
  Crown,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TourismEthiopia() {
  const [search, setSearch] = useState("");
  const [showPinned, setShowPinned] = useState(true);

  // Regular tourism packages as per image
  const tours = [
    {
      category: "4-Week Rotation Plan",
      icon: <Map className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />,
      destinations: [
        "Week 1 → Destination A",
        "Week 2 → Destination B",
        "Week 3 → Destination C",
        "Week 4 → Destination D",
      ],
    },
    {
      category: "Monthly Plan",
      icon: <Calendar className="w-6 h-6 md:w-8 md:h-8 text-green-600" />,
      destinations: [
        "Full month travel schedule",
        "Pre-planned routes & fixed dates",
      ],
    },
    {
      category: "Special Offers",
      icon: <Landmark className="w-6 h-6 md:w-8 md:h-8 text-pink-600" />,
      destinations: [
        "Discounted packages for groups",
        "Seasonal events and festivals",
      ],
    },
    {
      category: "Included Services",
      icon: <Building className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      destinations: [
        "Transportation (shared or private options)",
        "Guided tours with experienced local guides",
      ],
    },
  ];

  // VIP Tourism Pinned Card as per image
  const pinnedSite = {
    name: "VIP Custom Tourism – Lalibela Experience",
    image: "/lali.jpg",
    description:
      "A fully customizable luxury experience for high-end clients. Design your own itinerary, choose travel dates, and enjoy premium comfort throughout your Ethiopian journey.",
    date: "Flexible Dates – On Your Schedule",
    highlights: [
      "Create your own custom itinerary (destination, pickup time, transportation, activities)",
      "Flexible travel dates & locations",
      "VIP transportation options (private car, limo, luxury bus, helicopter if available)",
      "Personal tour guide / concierge",
      "Private booking management by our team",
      "Premium pricing model for unmatched service quality",
    ],
    isVIP: true,
  };

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
          Choose between our regular tourism packages for an easy and affordable
          travel plan or our VIP custom tourism for a fully personalized and
          luxurious experience.
        </p>
      </header>

      {/* VIP Pinned Card */}
      {showPinned && (
        <section className="max-w-5xl mx-auto px-4 md:px-6 -mt-8 mb-12 relative">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition relative">
            {/* Close button */}
            <button
              onClick={() => setShowPinned(false)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* VIP Badge */}
            {pinnedSite.isVIP && (
              <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-lg">
                <Crown className="w-4 h-4" /> VIP Tour
              </div>
            )}

            <img
              src={pinnedSite.image}
              alt={pinnedSite.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {pinnedSite.name}
                </h2>
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
                  {pinnedSite.date}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{pinnedSite.description}</p>
              <ul className="space-y-2 text-gray-700 mb-6">
                {pinnedSite.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={"/Vipinquirypage"}>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition">
                  Inquire & Book VIP Tour
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden">
          <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search regular packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 md:px-4 md:py-3 outline-none text-sm md:text-base"
          />
        </div>
      </div>

      {/* Regular Tourism Packages */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-800 text-center">
          Regular Tourism Packages
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
            No matching packages found.
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
            Whether you choose our budget-friendly regular packages or our
            premium VIP services, we’ll make your Ethiopian journey
            unforgettable.
          </p>
          <Link href={"/Booktour"}>
            <button className="bg-white text-green-700 font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-base">
              Book Now
            </button>
          </Link>
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
