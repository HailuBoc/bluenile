"use client";
import { useState } from "react";
import { Camera, Utensils, Gift, Users, Search } from "lucide-react";

export default function EventServices() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const services = [
    {
      title: "Photography & Videography",
      description:
        "Professional coverage to capture every special moment of your event with stunning clarity.",
      icon: <Camera className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />,
    },
    {
      title: "Catering & Food Service",
      description:
        "Custom menus and world-class catering for weddings, meetings, and private gatherings.",
      icon: <Utensils className="w-8 h-8 md:w-10 md:h-10 text-green-600" />,
    },
    {
      title: "Event Decoration",
      description:
        "Beautiful, personalized decorations to match your theme and style perfectly.",
      icon: <Gift className="w-8 h-8 md:w-10 md:h-10 text-pink-600" />,
    },
    {
      title: "Guest Management",
      description:
        "Seamless coordination, seating, and hospitality services for your attendees.",
      icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />,
    },
  ];

  const highlights = [
    "Experienced event planning professionals",
    "Premium equipment & modern designs",
    "Customizable packages for any budget",
    "Timely delivery & hassle-free setup",
  ];

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(destination.toLowerCase()) ||
      service.description.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-12 md:py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold">Event Services</h1>
        <p className="mt-3 md:mt-4 text-base md:text-xl max-w-2xl mx-auto">
          Full event support including photography, catering, decoration, and
          other professional services for weddings, meetings, and gatherings.
        </p>
      </header>

      {/* Search Bar */}
      <div className="w-full max-w-5xl mx-auto mt-6 md:mt-8 px-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border rounded-full shadow-lg px-4 md:px-6 py-3 bg-white bg-opacity-90 space-y-3 md:space-y-0">
          {/* Destination */}
          <div className="flex flex-col px-2 md:px-4 border-b md:border-b-0 md:border-r min-w-[100px] md:min-w-[150px]">
            <label className="text-xs text-gray-500 font-semibold">
              Service Search
            </label>
            <input
              type="text"
              placeholder="What service do you need?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Check-in */}
          <div className="flex flex-col px-2 md:px-4 border-b md:border-b-0 md:border-r min-w-[90px] md:min-w-[120px]">
            <label className="text-xs text-gray-500 font-semibold">
              Event Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          {/* Check-out */}
          <div className="flex flex-col px-2 md:px-4 border-b md:border-b-0 md:border-r min-w-[90px] md:min-w-[120px]">
            <label className="text-xs text-gray-500 font-semibold">
              End Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col px-2 md:px-4 min-w-[80px] md:min-w-[100px]">
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
          <div className="flex justify-center md:pl-4">
            <Search
              className="h-6 w-6 md:h-8 md:w-8 text-white bg-blue-600 p-1.5 md:p-2 rounded-full cursor-pointer shadow-lg"
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

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-800 text-center">
          Our Professional Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {filteredServices.map((service, index) => (
            <div
              key={index}
              className="bg-white p-4 md:p-6 rounded-2xl shadow-md hover:shadow-xl transition text-center"
            >
              <div className="mb-3 md:mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-1 md:mb-2">
                {service.title}
              </h3>
              <p className="text-xs md:text-base text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-10 md:py-12">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6 text-gray-800">
            Why Choose Us?
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {highlights.map((item, index) => (
              <li
                key={index}
                className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition text-gray-700 text-sm md:text-base"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 md:py-12">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
            Let’s Make Your Event Unforgettable
          </h2>
          <p className="mb-4 md:mb-6 text-sm md:text-lg">
            Contact our team today to start planning your perfect event with
            full professional support.
          </p>
          <button className="bg-white text-blue-700 font-bold py-2 px-6 md:py-3 md:px-8 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-base">
            Get a Quote
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 md:py-8 text-center mt-8 md:mt-10 text-sm md:text-base">
        <p>
          &copy; {new Date().getFullYear()} Event Services. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
