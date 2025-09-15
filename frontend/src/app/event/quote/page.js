"use client";
import { useState } from "react";

export default function GetQuotePage() {
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
          text: `🎉 Quote submitted! Estimated total: ${totalPrice} ETB. We’ll contact you shortly.`,
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

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Request a Quote
        </h1>

        {feedback.text && (
          <div
            className={`mb-4 p-3 rounded text-center font-medium ${
              feedback.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
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
            className="w-full p-3 border rounded-lg outline-none"
            required
          >
            <option value="">Select Event Type</option>
            {Object.keys(eventServices).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={form.guests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
          />

          {form.eventType && (
            <div>
              <h3 className="font-semibold mb-2">Select Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {eventServices[form.eventType].map((service, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 border p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.selectedServices.includes(service.name)}
                      onChange={() => handleServiceChange(service)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>
                      {service.name} ({service.price} ETB)
                    </span>
                  </label>
                ))}
              </div>
              <div className="font-semibold text-lg mt-2">
                Total Price: {totalPrice} ETB
              </div>
            </div>
          )}

          <textarea
            name="message"
            placeholder="Additional details..."
            value={form.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
            rows={4}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
