"use client";
import { GraduationCap, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function GraduationsPage() {
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

    // Validate
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
      text: `🎓 Graduation booking submitted successfully! We’ll reach out to ${formData.email}.`,
      type: "success",
    });

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      date: "",
      guests: "",
      specialRequests: "",
      selectedServices: [],
    });
  };

  // Auto-hide messages after 4s
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16 text-center px-4">
        <GraduationCap className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-4xl font-bold">Graduations</h1>
        <p className="mt-3 text-lg max-w-xl mx-auto">
          Celebrate your academic success in style with our graduation packages.
        </p>
      </header>

      {/* Services */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Our Graduation Services</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>
      </section>

      {/* Registration Form */}
      <section className="bg-white py-12 px-4 sm:px-6 max-w-3xl mx-auto shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Book Your Graduation Celebration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Info */}
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

          {/* Services Selection */}
          <div>
            <h3 className="font-semibold mb-2">Select Services</h3>
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

          {/* Special Requests */}
          <textarea
            name="specialRequests"
            placeholder="Special Requests"
            value={formData.specialRequests}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />

          {/* Success / Error Message */}
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

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
          >
            Submit Booking
          </button>
        </form>
      </section>
    </div>
  );
}
