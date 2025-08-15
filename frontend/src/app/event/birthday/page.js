"use client";
import { Cake } from "lucide-react";
import { useState } from "react";

export default function BirthdaysPage() {
  const services = [
    "Hall",
    "Photography & Videography",
    "Catering",
    "Decoration",
    "DJ",
    "Car Service",
    "Guest Management",
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
    alert(`Birthday booking submitted for ${formData.name}! 🎉`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-16 text-center">
        <Cake className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Birthday Parties</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto">
          Fun, festive, and unforgettable birthday celebrations for all ages.
        </p>
      </header>

      {/* Services */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Our Birthday Party Services</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>
      </section>

      {/* Registration Form */}
      <section className="bg-white py-12 px-4 max-w-3xl mx-auto shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your Birthday Party
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
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
          >
            Submit Booking
          </button>
        </form>
      </section>
    </div>
  );
}
