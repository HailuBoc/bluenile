"use client";
import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react"; // npm i lucide-react

export default function Home() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [propertyType, setPropertyType] = useState("");

  const properties = [
    {
      id: 1,
      title: "Luxury Beachfront Villa",
      type: "House",
      location: "Malibu, California",
      price: "450 birr / night",
      img: "/p1.png",
    },
    {
      id: 2,
      title: "City Center Apartment",
      type: "Apartment",
      location: "New York City, USA",
      price: "200 birr / night",
      img: "/p2.png",
    },
    {
      id: 3,
      title: "Cozy Guesthouse",
      type: "Guesthouse",
      location: "Kyoto, Japan",
      price: "120 birr / night",
      img: "/p3.png",
    },
    {
      id: 4,
      title: "Modern Hotel Apartment",
      type: "Hotel Apartment",
      location: "Dubai, UAE",
      price: "300 birr / night",
      img: "/p4.png",
    },
  ];

  const filteredProperties = properties.filter(
    (property) =>
      (property.title.toLowerCase().includes(destination.toLowerCase()) ||
        property.location.toLowerCase().includes(destination.toLowerCase())) &&
      (propertyType
        ? property.type.toLowerCase() === propertyType.toLowerCase()
        : true)
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-10 sm:py-16 px-4 sm:px-8 text-center">
        <h1 className="text-2xl sm:text-5xl font-bold">
          Property Rentals & Event Bookings
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-xl">
          Houses, apartments, guesthouses, hotel apartments, wedding & meeting
          halls — all in one place.
        </p>
      </header>

      {/* Properties Section */}
      <div className="bg-slate-400">
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
          <h2 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-8 text-gray-800">
            Find Your Perfect Stay
          </h2>

          {/* Advanced Search Bar */}
          <div className="w-full max-w-5xl mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center border rounded-2xl shadow-lg px-4 sm:px-6 py-3 bg-white bg-opacity-90 gap-3 sm:gap-0">
              {/* Destination */}
              <div className="flex flex-col flex-1 sm:border-r border-gray-300 pr-0 sm:pr-4">
                <label className="text-xs text-gray-500 font-semibold">
                  where is your property?
                </label>
                <input
                  type="text"
                  placeholder="City, landmark, or address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Property Type */}
              <div className="flex flex-col flex-1 sm:border-r border-gray-300 pr-0 sm:pr-4">
                <label className="text-xs text-gray-500 font-semibold">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-700"
                >
                  <option value="">Any</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Guesthouse">Guesthouse</option>
                  <option value="Hotel Apartment">Car</option>
                </select>
              </div>

              {/* Check-in */}
              <div className="flex flex-col sm:w-32 sm:border-r border-gray-300">
                <label className="text-xs text-gray-500 font-semibold">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-700"
                />
              </div>

              {/* Check-out */}
              <div className="flex flex-col sm:w-32 sm:border-r border-gray-300">
                <label className="text-xs text-gray-500 font-semibold">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-700"
                />
              </div>

              {/* Guests */}
              <div className="flex flex-col sm:w-20">
                <label className="text-xs text-gray-500 font-semibold">
                  Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-center justify-center sm:pl-4">
                <button
                  onClick={() =>
                    console.log("Searching:", {
                      destination,
                      propertyType,
                      checkIn,
                      checkOut,
                      guests,
                    })
                  }
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm hover:bg-blue-700 transition"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <Image
                  src={property.img}
                  alt={property.title}
                  width={500}
                  height={300}
                  className="w-full h-28 sm:h-48 object-cover"
                />
                <div className="p-3 sm:p-5">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
                    {property.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {property.type}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {property.location}
                  </p>
                  <p className="text-blue-600 font-bold mt-1 sm:mt-2 text-sm sm:text-base">
                    {property.price}
                  </p>
                  <button className="mt-2 sm:mt-4 w-full bg-blue-600 text-white text-xs sm:text-sm py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
