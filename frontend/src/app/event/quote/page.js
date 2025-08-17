"use client";
import { useState } from "react";

export default function GetQuotePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guests: "",
    message: "",
  });

  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example validation
    if (!form.name || !form.email || !form.phone) {
      setFeedback({
        type: "error",
        text: "⚠️ Please fill all required fields.",
      });
      setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
      return;
    }

    console.log("Quote Request Submitted:", form);

    // Success message
    setFeedback({
      type: "success",
      text: "🎉 Your quote request has been sent! We’ll contact you shortly.",
    });
    setTimeout(() => setFeedback({ type: "", text: "" }), 4000);

    // Reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      guests: "",
      message: "",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Request a Quote
        </h1>

        {/* Success/Error Message */}
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
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
            required
          >
            <option value="">Select Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Graduation">Graduation</option>
            <option value="General Event">General Event</option>
          </select>
          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
            required
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={form.guests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
            required
          />
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
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
