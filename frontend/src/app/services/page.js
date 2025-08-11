"use client";
import { Home, Calendar, Car, ShoppingBag, Globe } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: <Home className="w-10 h-10 text-blue-600" />,
      title: "Property Rentals & Bookings",
      description:
        "Houses, apartments, guesthouses, and hotel apartments for short or long-term stays. Wedding and meeting halls for events with full booking support.",
    },
    {
      icon: <Calendar className="w-10 h-10 text-pink-600" />,
      title: "Event Services",
      description:
        "Full event support including photography, catering, decoration, and professional services for weddings, meetings, and gatherings.",
    },
    {
      icon: <Car className="w-10 h-10 text-green-600" />,
      title: "Transport Services",
      description:
        "Car rentals with drivers for daily or monthly use. Executive cars and vans for tours, events, and corporate needs.",
    },
    {
      icon: <ShoppingBag className="w-10 h-10 text-yellow-600" />,
      title: "Sales Section",
      description:
        "Verified listings of apartments, houses, lands, and vehicles for sale—direct from trusted owners or companies.",
    },
    {
      icon: <Globe className="w-10 h-10 text-purple-600" />,
      title: "Tourism Services",
      description:
        "Tailor-made tours across Ethiopia, from historic routes to cultural and natural destinations. Serving locals, travelers, and the diaspora.",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Our Services
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
          Blue Nile is your trusted all-in-one platform for property, events,
          transport, sales, and tourism in Ethiopia.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            {service.icon}
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              {service.title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 max-w-3xl mx-auto text-center bg-blue-600 text-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">
          Whether you’re booking a property, planning an event, arranging
          transport, or exploring Ethiopia, we’ve got you covered.
        </p>
        <a
          href="/contact"
          className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
