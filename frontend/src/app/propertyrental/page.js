"use client";
import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react"; // make sure to install lucide-react: npm i lucide-react

export default function Home() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

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
      property.title.toLowerCase().includes(destination.toLowerCase()) ||
      property.location.toLowerCase().includes(destination.toLowerCase()) ||
      property.type.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-16 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Property Rentals & Event Bookings
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Houses, apartments, guesthouses, hotel apartments, wedding & meeting
          halls — all in one place.
        </p>
      </header>

      {/* Properties Section */}
      <div className="bg-slate-400">
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Short & Long-Term Stays
          </h2>

          {/* Advanced Search Bar */}
          <div className="w-full max-w-5xl mb-8 animate-fadeUp animation-delay-300">
            <div className="flex items-center justify-between border rounded-full shadow-lg px-6 py-3 bg-white bg-opacity-90">
              {/* Destination */}
              <div className="flex flex-col px-4 border-r min-w-[150px]">
                <label className="text-xs text-gray-500 font-semibold">
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Check-in */}
              <div className="flex flex-col px-4 border-r min-w-[120px]">
                <label className="text-xs text-gray-500 font-semibold">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700"
                />
              </div>

              {/* Check-out */}
              <div className="flex flex-col px-4 border-r min-w-[120px]">
                <label className="text-xs text-gray-500 font-semibold">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700"
                />
              </div>

              {/* Guests */}
              <div className="flex flex-col px-4 min-w-[100px]">
                <label className="text-xs text-gray-500 font-semibold">
                  Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <div className="pl-4">
                <Search
                  className="h-8 w-8 text-white bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg"
                  onClick={() =>
                    console.log("Searching:", {
                      destination,
                      checkIn,
                      checkOut,
                      guests,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <Image
                  src={property.img}
                  alt={property.title}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {property.title}
                  </h3>
                  <p className="text-gray-500">{property.type}</p>
                  <p className="text-gray-500 text-sm">{property.location}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    {property.price}
                  </p>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
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
