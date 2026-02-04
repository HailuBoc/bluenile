"use client";

import { Home, CheckCircle, XCircle, Star, StarHalf, Star as StarOutline, Calculator } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function GetQuoteContent() {
  const eventServices = {
    Wedding: [
      { name: "Church / Mosque Venue", price: 5000 },
      { name: "Religious Ceremony Setup", price: 3000 },
      { name: "Choir / Spiritual Music", price: 1500 },
      { name: "Photography & Videography", price: 4000 },
      { name: "Decoration & Flowers", price: 2500 },
      { name: "Catering", price: 3500 },
      { name: "DJ / Music Setup", price: 2000 },
      { name: "Car Service", price: 1000 },
      { name: "Guest Management", price: 800 },
    ],
    Birthday: [
      { name: "Hall", price: 3000 },
      { name: "Photography & Videography", price: 2000 },
      { name: "Catering", price: 2500 },
      { name: "Decoration", price: 1200 },
      { name: "DJ", price: 1000 },
      { name: "Car Service", price: 800 },
      { name: "Guest Management", price: 700 },
    ],
    Graduation: [
      { name: "Hall", price: 3500 },
      { name: "Photography & Videography", price: 2000 },
      { name: "Catering", price: 2500 },
      { name: "Decoration", price: 1200 },
      { name: "DJ", price: 1000 },
      { name: "Car Service", price: 800 },
      { name: "Guest Management", price: 700 },
    ],
    "General Event": [
      { name: "Event Hall / Meeting Room", price: 3000 },
      {
        name: "Audio-Visual Setup (Projectors, Screens, Microphones)",
        price: 1500,
      },
      { name: "Photography & Videography", price: 2000 },
      { name: "Catering (Snacks, Lunch, Coffee Breaks)", price: 2500 },
      { name: "Decoration & Branding (Banners, Backdrops)", price: 1200 },
      { name: "Event Coordinator & Staff Support", price: 1000 },
      { name: "Transportation Service (VIP Pickup, Shuttle)", price: 800 },
      { name: "Guest Management & Registration Desk", price: 700 },
    ],
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guests: "",
    selectedServices: [],
    message: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (service) => {
    setForm((prev) => {
      const updatedServices = prev.selectedServices.includes(service.name)
        ? prev.selectedServices.filter((s) => s !== service.name)
        : [...prev.selectedServices, service.name];

      // Recalculate total
      const price = updatedServices.reduce((acc, s) => {
        const srv = eventServices[form.eventType].find(
          (item) => item.name === s
        );
        return acc + (srv ? srv.price : 0);
      }, 0);
      setTotalPrice(price);

      return { ...prev, selectedServices: updatedServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "eventType"];
    const missing = requiredFields.filter((field) => !form[field]);
    if (missing.length > 0) {
      setFeedback({
        type: "error",
        text: `⚠️ Missing required fields: ${missing.join(", ")}`,
      });
      setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
      return;
    }

    setLoading(true);
    setFeedback({ type: "", text: "" });

    try {
      const res = await fetch("https://bluenile.onrender.com/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalPrice }),
      });

      const data = await res.json();

      if (res.ok) {
        setFeedback({
          type: "success",
          text: `🎉 Quote submitted! Estimated total: ${totalPrice} ETB. We'll contact you shortly.`,
        });
        setForm({
          name: "",
          email: "",
          phone: "",
          eventType: "",
          eventDate: "",
          guests: "",
          selectedServices: [],
          message: "",
        });
        setTotalPrice(0);
      } else {
        setFeedback({
          type: "error",
          text: data.error || "❌ Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      setFeedback({
        type: "error",
        text: "❌ Network error. Please try again.",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Star key={i} className="h-5 w-5 text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<StarHalf key={i} className="h-5 w-5 text-yellow-400" />);
      else
        stars.push(<StarOutline key={i} className="h-5 w-5 text-gray-400" />);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Event Quote
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative overflow-hidden py-10 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-indigo-500/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Request a Quote
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Get a personalized quote for your special event
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {renderStars(4.8)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (4.8) • 3,200+ quotes generated
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          {feedback.text && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-6 ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={(e) => {
                    handleChange(e);
                    setForm((prev) => ({ ...prev, selectedServices: [] }));
                    setTotalPrice(0);
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Event Type</option>
                  {Object.keys(eventServices).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  name="guests"
                  placeholder="Number of Guests"
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Services Selection */}
            {form.eventType && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Select Services
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eventServices[form.eventType].map((service, i) => (
                    <label
                      key={i}
                      className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        form.selectedServices.includes(service.name)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={form.selectedServices.includes(service.name)}
                          onChange={() => handleServiceChange(service)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {service.name}
                        </span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {service.price} ETB
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Total Price */}
            {totalPrice > 0 && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    💰 Estimated Total
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalPrice} ETB
                  </span>
                </div>
              </div>
            )}

            {/* Additional Message */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Additional Details
              </h4>
              <textarea
                name="message"
                placeholder="Tell us more about your event requirements..."
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit Quote Request"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function GetQuotePage() {
  return <GetQuoteContent />;
}
