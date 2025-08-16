"use client";
import { Calendar } from "lucide-react";
import { useState } from "react";

export default function GeneralEventsPage() {
  const services = [
    "Event Hall / Meeting Room",
    "Audio-Visual Setup (Projectors, Screens, Microphones)",
    "Photography & Videography",
    "Catering (Snacks, Lunch, Coffee Breaks)",
    "Decoration & Branding (Banners, Backdrops)",
    "Event Coordinator & Staff Support",
    "Transportation Service (VIP Pickup, Shuttle)",
    "Guest Management & Registration Desk",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: "",
    services: [],
    specialRequests: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const updatedServices = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: updatedServices };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `📅 General Event booking submitted!\nName: ${formData.name}\nEmail: ${
        formData.email
      }\nDate: ${formData.date}\nGuests: ${
        formData.guests
      }\nServices: ${formData.services.join(", ")}\nRequests: ${
        formData.specialRequests
      }`
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">General Events</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto px-4">
          From conferences to community gatherings — we handle it all.
        </p>
      </header>

      {/* Registration Form */}
      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Book Your Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Guests */}
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />

          {/* Services Checkboxes */}
          <div>
            <h3 className="font-semibold mb-2">Select Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.map((service, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                    className="w-4 h-4"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <textarea
            name="specialRequests"
            placeholder="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition w-full sm:w-auto"
          >
            Submit Booking
          </button>
        </form>
      </section>
    </div>
  );
}
