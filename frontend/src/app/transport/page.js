"use client";
import { useState } from "react";
import Link from "next/link";
import { Car, Bus, Briefcase, MapPin, Search } from "lucide-react";

export default function TransportServices() {
  const [searchData, setSearchData] = useState({
    start: "",
    end: "",
    date: "",
    guests: 1,
  });

  // Fleet data (sample vehicles)
  const fleet = [
    {
      id: 1,
      title: "Toyota Land Cruiser Prado",
      description:
        "Luxury SUV with high comfort, perfect for city & outstation trips.",
      price: "3,200,000 birr",
      icon: <Car className="w-12 h-12 text-blue-600" />,
    },
    {
      id: 2,
      title: "Hiace Van",
      description: "Spacious van for group tours and family trips.",
      price: "1,800,000 birr",
      icon: <Bus className="w-12 h-12 text-green-600" />,
    },
    {
      id: 3,
      title: "Executive Sedan",
      description: "Stylish sedan for business meetings and VIP guests.",
      price: "2,400,000 birr",
      icon: <Car className="w-12 h-12 text-purple-600" />,
    },
    {
      id: 4,
      title: "Tour Bus",
      description: "Large bus for city tours and event transportation.",
      price: "5,500,000 birr",
      icon: <Bus className="w-12 h-12 text-red-600" />,
    },
  ];

  const highlights = [
    {
      title: "Daily, Weekly & Monthly Rentals",
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
      vehicle.title.toLowerCase().includes(searchData.start.toLowerCase()) ||
      vehicle.title.toLowerCase().includes(searchData.end.toLowerCase()) ||
      vehicle.description
        .toLowerCase()
        .includes(searchData.start.toLowerCase()) ||
      vehicle.description.toLowerCase().includes(searchData.end.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold">Transport Services</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Car rentals with drivers for daily or monthly use. Executive cars and
          vans for tours, events, and corporate needs.
        </p>
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-5xl mx-auto mt-6 px-4">
        <div className="flex flex-col md:flex-row items-stretch gap-3 border rounded-2xl shadow-lg p-4 bg-white">
          {/* Start Point */}
          <div className="flex flex-col flex-1">
            <label className="text-xs font-semibold text-gray-500">
              Start Point
            </label>
            <input
              type="text"
              placeholder="Enter pickup location"
              value={searchData.start}
              onChange={(e) =>
                setSearchData({ ...searchData, start: e.target.value })
              }
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* End Point */}
          <div className="flex flex-col flex-1">
            <label className="text-xs font-semibold text-gray-500">
              End Point
            </label>
            <input
              type="text"
              placeholder="Enter drop-off location"
              value={searchData.end}
              onChange={(e) =>
                setSearchData({ ...searchData, end: e.target.value })
              }
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col w-full md:w-40">
            <label className="text-xs font-semibold text-gray-500">
              Travel Date
            </label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) =>
                setSearchData({ ...searchData, date: e.target.value })
              }
              className="bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col w-full md:w-28">
            <label className="text-xs font-semibold text-gray-500">
              Passengers
            </label>
            <input
              type="number"
              min="1"
              value={searchData.guests}
              onChange={(e) =>
                setSearchData({ ...searchData, guests: e.target.value })
              }
              className="bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          {/* Search Button */}
          <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Fleet */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Our Fleet
        </h2>
        {filteredFleet.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFleet.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/transport/${vehicle.id}`}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition block"
              >
                <div className="mb-3 flex justify-center">{vehicle.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 text-center">
                  {vehicle.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {vehicle.description}
                </p>
                <p className="text-blue-600 font-semibold text-center mt-2">
                  {vehicle.price}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No matching vehicles found.
          </p>
        )}
      </section>

      {/* Highlights */}
      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            Why Ride With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 p-6 rounded-lg shadow-sm text-center"
              >
                <div className="flex justify-center mb-2">{item.icon}</div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-3">Book Your Ride Today</h2>
          <p className="mb-5 text-lg">
            Reliable transport for business, leisure, and special events —
            anytime, anywhere.
          </p>
          <button className="bg-white text-green-700 font-bold py-2 px-6 rounded-lg shadow hover:bg-gray-100 transition">
            Get a Quote
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} Transport Services. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

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
