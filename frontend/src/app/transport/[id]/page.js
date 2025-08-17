"use client";
import { Car, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { use } from "react"; // 👈 unwrap params
import { fleet } from "../../../data/fleet"; // ✅ Import fleet

export default function TransportDetailPage({ params }) {
  const { id } = use(params); // unwrap params safely

  // Find the selected car
  const transport =
    fleet.find((item) => String(item.id) === String(id)) || fleet[0];

  const services = [
    "Chauffeur",
    "Fuel Included",
    "Air Conditioning",
    "Wedding Decoration",
    "Music System",
    "Extra Hours",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    guests: "",
    specialRequests: "",
    selectedServices: [],
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const selected = prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service];
      return { ...prev, selectedServices: selected };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.date ||
      !formData.guests
    ) {
      setMessage({
        text: "❌ Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    setMessage({
      text: `✅ Booking for "${transport.title}" submitted successfully! We’ll reach out to ${formData.email}.`,
      type: "success",
    });

    setFormData({
      name: "",
      email: "",
      date: "",
      guests: "",
      specialRequests: "",
      selectedServices: [],
    });
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 text-center px-4">
        <Car className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">{transport.title}</h1>
        <p className="mt-3 text-lg max-w-2xl mx-auto">
          {transport.description}
        </p>
        <p className="mt-2 font-semibold">{transport.price}</p>
      </header>

      {/* Booking Form */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <Car className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Book Your Car</h2>
            <p className="mt-2 text-gray-600">
              Reserve your preferred car with extra services for your event.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl mx-auto">
            {/* Selected Car */}
            <input
              type="text"
              value={transport.title}
              readOnly
              className="w-full border rounded px-4 py-2 bg-gray-100 font-semibold text-gray-700"
            />

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
              placeholder="Number of Passengers"
              value={formData.guests}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />

            {/* Extra Services */}
            <div>
              <h3 className="font-semibold mb-2">Select Extra Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((service, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 border rounded px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="accent-green-600"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <textarea
              name="specialRequests"
              placeholder="Special Requests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />

            {/* Messages */}
            {message.text && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
            >
              Submit Booking
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
