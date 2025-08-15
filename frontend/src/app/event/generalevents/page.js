"use client";
import { Briefcase } from "lucide-react";
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
    specialRequests: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`General Event booking submitted for ${formData.name}! 📅`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center">
        <Briefcase className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">General Events</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto">
          Perfect solutions for meetings, conferences, and corporate events.
        </p>
      </header>

      {/* Services */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Our General Event Services</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>
      </section>

      {/* Registration Form */}
      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your General Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
          <textarea
            name="specialRequests"
            placeholder="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Booking
          </button>
        </form>
      </section>
    </div>
  );
}
